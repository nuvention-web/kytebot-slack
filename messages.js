export const mentor_or_mentee_message = JSON.parse('{ "text": "Hi! Before you start with Kyte we need to ask one quick question : )",' +
                                            '"attachments": [' +
                                                '{  "text": "How old are you?",' +
                                                    '"fallback": "You are unable to choose a game",' +
                                                    '"callback_id": "mentor_or_mentee",' +
                                                    '"color": "#3AA3E3",' +
                                                    '"attachment_type": "default",' +
                                                    '"actions": [' +
                                                        '{  "name": "mentee",' +
                                                            '"text": "High School",' +
                                                            '"type": "button",' +
                                                            '"value": "highschool" },' +
                                                        '{  "name": "mentor",' +
                                                            '"text": "College",' +
                                                            '"type": "button",' +
                                                            '"value": "college" },' +
                                                        '{  "name": "mentor",' +
                                                            '"text": "Industry Professional",' +
                                                            '"type": "button",' +
                                                            '"value": "industry" }]}]}');