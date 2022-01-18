const express = require("express");
const url = require(`url`);
const path = require(`path`);
const { Permissions } = require("discord.js");
const passport = require(`passport`);
const bodyParser = require("body-parser");
const Strategy = require(`passport-discord`).Strategy;
const BotConfig = require("../../Musicium/botconfig/config.json");
const BotFilters = require("../../Musicium/botconfig/filters.json");
const BotEmojis = require("../../Musicium/botconfig/emojis.json");


module.exports = client => {
    const settings = require("./settings.json");

    const app = express();
    const httpApp = express();
    const session = require(`express-session`);
    const MemoryStore = require(`memorystore`)(session);


    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
    passport.use(new Strategy({
      clientID: settings.config.clientID,
      clientSecret: settings.config.secret,
      callbackURL: settings.config.callback,      
      scope: [`identify`, `guilds`, `guilds.join`]
    },
    (accessToken, refreshToken, profile, done) => { 
      process.nextTick(() => done(null, profile));
    }));

    app.use(session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: `nQZvXa4QR6unmYEnkqV6eTcKQjfvYxI1t9BvsToqfvdhZTDlvfbfdozYgszkbluK`,
        resave: false,
        saveUninitialized: false,
    }));

    //init middleware
    app.use(passport.initialize());
    app.use(passport.session());


    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './views'))


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
      extended: true
    }));

    //static routes
    app.use(express.static(path.join(__dirname, './public')));
    app.use(express.static(path.join(__dirname, '/'), {dotfiles: 'allow'}));

    const checkAuth = (req, res, next) => {
      if (req.isAuthenticated()) return next();
      req.session.backURL = req.url;
      res.redirect("/login");
    };

    //login route
    app.get(`/login`, (req, res, next) => {
        if (req.session.backURL) {
          req.session.backURL = req.session.backURL; 
        } else if (req.headers.referer) {
          const parsed = url.parse(req.headers.referer);
          if (parsed.hostname === app.locals.domain) {
            req.session.backURL = parsed.path;
          }
        } else {
          req.session.backURL = `/`;
        }
        next();
      }, passport.authenticate(`discord`, { prompt: `none` })
    );


    //callback route - check login data
    app.get(`/callback`, passport.authenticate(`discord`, { failureRedirect: "/" }), async (req, res) => {
        let banned = false // req.user.id
        if(banned) {
                req.session.destroy(() => {
                res.json({ login: false, message: `You have been blocked from the Dashboard.`, logout: true })
                req.logout();
            });
        } else {
            res.redirect(`/queue`)
        }
    });



    //When the website is loaded on the main page, render the main page + with those variables
    app.get("/", (req, res) => {
        res.render("index", {
          req: req,
          user: req.isAuthenticated() ? req.user : null,
          //guild: client.guilds.cache.get(req.params.guildID),
          botClient: client,
          Permissions: Permissions,
          bot: settings.website,
          callback: settings.config.callback,
          categories: client.categories, 
          commands: client.commands, 
          BotConfig: BotConfig,
          BotFilters: BotFilters,
          BotEmojis: BotEmojis,
        });
    })


    // When the commands page is loaded, render it with those settings
    app.get("/commands", (req, res) => {
      res.render("commands", {
        req: req,
        user: req.isAuthenticated() ? req.user : null,
        //guild: client.guilds.cache.get(req.params.guildID),
        botClient: client,
        Permissions: Permissions,
        bot: settings.website,
        callback: settings.config.callback,
        categories: client.categories, 
        commands: client.commands, 
        BotConfig: BotConfig,
        BotFilters: BotFilters,
        BotEmojis: BotEmojis,
      })
    })


    //Logout the user and move him back to the main page
    app.get(`/logout`, function (req, res) {
      req.session.destroy(() => {
        req.logout();
        res.redirect(`/`);
      });
    });


    // Queue Dash
    app.get("/queue/:guildID", async (req,res) => {
        if(!req.isAuthenticated() || !req.user)
            return res.redirect("/?error=" + encodeURIComponent("Login First!"));
        if(!req.user.guilds)
            return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
      res.render("queue", {
        req: req,
        user: req.isAuthenticated() ? req.user : null,
        guild: client.guilds.cache.get(req.params.guildID),
        botClient: client,
        Permissions: Permissions,
        bot: settings.website,
        callback: settings.config.callback,
        categories: client.categories, 
        commands: client.commands, 
        BotConfig: BotConfig,
        BotFilters: BotFilters,
        BotEmojis: BotEmojis,
      });
    })


    //Queue Dashes
    app.get("/queue", checkAuth, async (req,res) => {
      if(!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
      if(!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
      res.render("queuedashboard", {
        req: req,
        user: req.isAuthenticated() ? req.user : null,
        //guild: client.guilds.cache.get(req.params.guildID),
        botClient: client,
        Permissions: Permissions,
        bot: settings.website,
        callback: settings.config.callback,
        categories: client.categories, 
        commands: client.commands, 
        BotConfig: BotConfig,
        BotFilters: BotFilters,
        BotEmojis: BotEmojis,
      });
    })


    //init webserver
    const http = require(`http`).createServer(app);
    http.listen(settings.config.http.port, () => {
        console.log(`[${settings.website.domain}]: HTTP-Website running on ${settings.config.http.port} port.`)
    });
}
