'use strict';

 const axios = require("axios");

 let api = axios.create({ baseURL: "http://localhost:1337" });

module.exports = {
    async create( ctx )
    {
        let { name, email, password, mobile } = ctx.request.body;

        let response = {};

        let user = await strapi.query( 'user', 'users-permissions' ).findOne( {username: name } );

        if ( name != null && email != null && password != null && mobile != null && user == null)
        {
            let userRegisterReqBody = {
                username: name,
                email: email,
                password: password
            };
            let initSignup = await api.post(
                "/auth/local/register",
                userRegisterReqBody
            );

            let createUserInformationReqBody = {
                ParentName: name,
                Email: email,
                Mobile: mobile
              };
            await strapi.query("user-info").create(createUserInformationReqBody);
            response.userinformation = createUserInformationReqBody;

            response.status = "User registered..";
            response.accesstoken = initSignup.data.jwt;
            response.userid = initSignup.data.user._id;
            response.username = initSignup.data.user.username;
            response.email = initSignup.data.user.email;
            return response;
        }
        else
        {
            if (email != null && password != null && user != null )
            {
                let userLoginReqBody = {
                    identifier: email,
                    password: password,
                  };

                let initLogin = await api.post("/auth/local", userLoginReqBody);
                response.status = "User exists..";
                response.accesstoken = initLogin.data.jwt;
                response.userid = initLogin.data.user._id;
                response.username = initLogin.data.user.username;
                response.email = initLogin.data.user.email;

                let userInformation = await strapi.query( "user-info" ).findOne( { Email: email } );
                response.userinformation = userInformation

                let children = await strapi.query( 'child' ).find( { parentEmail: email, _limit: 10 } );

                for (var i in children )
                {
                    let reports = await strapi.query( "report" ).find( { ChildID: children[i].ChildID } );
                    children[i].reports = reports;
                }
                response.children = children;
                return response;
            }    
        }
    }
};
