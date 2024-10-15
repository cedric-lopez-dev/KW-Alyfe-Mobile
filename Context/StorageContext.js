import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getMember, getProperties } from '../services/UserService';
import { getMessages, getPropertiesStats, getProspects, getViews, getWebsite } from '../services/WebsiteService';
import { getLeads, getTeamLeaders } from '../services/LeadGen.service';

export const StorageContext = createContext()
export const DataProvider = ({ children }) => {

    const { email } = useContext(AuthContext)
    const [data, setData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)
    const { isLogged } = useContext(AuthContext)
    useEffect(() => {
        if (email) {
            sendGetWebsite(email)
                .then((website) => {
                    if (website) {
                        Promise.all([
                            sendGetViews(website.id),
                            sendGetMember(website.typeId),
                            sendGetMessages(website.id),
                            sendGetProspects(website.id),
                            sendGetProperties(website.typeId),
                        ]).then(() => {
                            setDataLoaded(true)
                        })
                    }

                    else {
                        setData({ noWebsite: true })
                        setDataLoaded(true)
                    }
                })
        }

    }, [email, isLogged])

    const sendGetWebsite = (email) => {
        return getWebsite({ email: email })
            .then((res) => {
                const website = res.data[0]
                setData((prevData) => ({ ...prevData, website: website }))
                return website;
            })
            .catch((error) => console.log("Error fetching website:", error));
    }
    const sendGetViews = (websiteId) => {
        return getViews(websiteId)
            .then((res) => {
                const sum = res.data.visits.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0);
                setData((prevData) => ({ ...prevData, visits: sum }))
            }
            )
            .catch((error) => {
                console.log("Error fetching views:", error)
            });
    }

    const sendGetMember = (memberId) => {
        return getMember(memberId)
            .then((res) => {
                const agent = res.data.agent
                setData((prevData) => ({
                    ...prevData,
                    agent: agent
                }));
            })
            .catch((error) => console.log("Error fetching member:", error));
    }
    const sendGetProperties = (memberId) => {
        return getProperties(memberId)
            .then((res) => {
                if (res.data.count) {
                    setData((prevData) => ({
                        ...prevData,
                        propertiesCount: res.data.count,
                        properties: res.data.properties

                    }));

                }
                return res.data

            })
            .catch((error) => {
                console.log("Error fetching properties:", error)
            }).then((res) => {
                sendGetPropertiesStats(res.properties)
            });
    }

    const sendGetMessages = (websiteId) => {
        return getMessages(websiteId)
            .then((res) => {
                if (res.data.messages > 0) {
                    setData((prevData) => ({
                        ...prevData,
                        messages: res.data.messages
                    }));
                }


            })
            .catch((error) => {
                console.log("Error fetching messages:", error)
            }
            )
            ;
    }
    const sendGetProspects = (websiteId) => {
        return getProspects(websiteId)
            .then((res) => {
                const prospectsNumbers = res.data.appraisals + res.data.buyers
                setData((prevData) => ({
                    ...prevData,
                    prospects: prospectsNumbers
                }));
            })
            .catch((error) => {
                console.log("Error fetching prospects:", error)
            }
            );
    }
    const sendGetPropertiesStats = (properties) => {

        if (properties) {
            const propertiesIds = properties.map((property) => {
                return property.id
            }).join(',')


            return getPropertiesStats(propertiesIds)
                .then((res) => {
                    const newArray = properties.map((property) => {
                        if (res.data.data[property.id]) {
                            const newProperty = property
                            newProperty.allViews = res.data.data[property.id].total
                            return newProperty
                        }
                        else {
                            return property
                        }
                    })
                    setData((prevData) => ({
                        ...prevData,
                        properties: newArray
                    }));
                })
                .catch((error) => {
                    console.log("Error fetching propertiesStats:", error)
                }
                );
        }
    }

    const sendGetTeamLeaders = () => {

        return getTeamLeaders()
            .then((res) => {
                const newArray = []
                res.data.teamLeaders.map((teamLeader) => {
                    const addTeamLeader = {
                        id: teamLeader?.id,
                        firstname: teamLeader?.firstname,
                        lastname: teamLeader?.lastname,
                        picture: teamLeader?.picture,
                        roleName: teamLeader.roleName,
                        marketCenter: {
                            name: teamLeader?.marketCenter.name,
                            city: teamLeader?.marketCenter?.city,
                            id: teamLeader?.marketCenter?.id,

                        }
                    }
                    newArray.push(addTeamLeader);
                });

                setData((prevData) => ({ ...prevData, teamLeaders: newArray }))
            }
            )
            .catch((error) => {
                console.log("Error fetching teamleaders:", error)
            });
    }
    const sendGetLeads = (agentId) => {

        return getLeads(agentId)
            .then((res) => {
                setData((prevData) => ({ ...prevData, leads: res.data.leads }))
            }
            )
            .catch((error) => {
                console.log("Error fetching teamleads:", error)
            });
    }


    return (
        <StorageContext.Provider value={{ data, dataLoaded, setData, setDataLoaded, sendGetTeamLeaders, sendGetLeads, sendGetProperties, sendGetPropertiesStats, sendGetProspects, sendGetMessages, sendGetViews }}>
            {children}
        </StorageContext.Provider>
    )
}