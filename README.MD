# Troop 87

### About
This is a Boy Scout Troop Website. It contains a home page with a calendar, map embed, list of links and resources, and a members area with a sign up sheet system for troop events, and a contact information update request form. Fully responsive, built with [Node.JS](http://nodejs.org), [MongoDB](http://www.mongodb.org), and [Materialize.css](http://materializecss.com).

### Instructions
1. Clone this repo with `git clone https://github.com/srustagi/troop-87.git`
2. Enter the directory `cd troop-87`
3. Install dependencies `npm install`
4. Create a `.env` file in the root and populate it with:
  - `DB_URI` — the URI for your MongoDB Connection
  - `USER` — the username for your members area
  - `PASS` — the password for your members area
  - `PORT` — the port the application is to run on
  - `SECRET` — a `String` which you'll use as your secret for the session

### Customization
This frontend for this project is done with Materialize.css, and you can find the reference at [their site](http://materializecss.com).