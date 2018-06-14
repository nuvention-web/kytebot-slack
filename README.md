# kytebot-slack

This is a slack app that monitors activity for and interacts with mentors and mentees!

It tracks files, links, messages sent, the last time a message was sent (and by who), and activity in mentor-mentee channels. It sends reminders to those who haven't been active, and is able to generate reports based on all information gathered.

To test it out, we've created a test slack for development. If you want to log into it, use the following information:

https://join.slack.com/t/slack-tests-group/shared_invite/enQtMzgwNjIyNjM2MDY0LTExMjU5ZTNhYmVjOTNhZjUzZmU0ZWE1OThlMjRmYjBlMzRkNzBiMWYwNjM0MDg1YmE0ZDViN2RkYzRhYTNiOTM

nuventiontest2018@outlook.com
test2018

To get a report, use the slash command /quickreport. Instructions for how to use it will come up in slack, but here's the basic usage:

/quickreport "name"

/quickreport "name" "name" "name" "name" "name" ....

/quickreport "Gabe Rojas-Westall" "Charbel"

/quickreport "Gabe" "Charbel Bourjas"


For data visualization, we will process it by request. To do this, we will create the appropriate graphs use d3.js. An example is provided in datavis.html



