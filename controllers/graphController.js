// controllers/graphController.js

// get the name of the app service instance from environment variables
const appServiceName = process.env.WEBSITE_SITE_NAME;

const graphHelper = require('../utils/graphHelper');
const { DefaultAzureCredential } = require("@azure/identity");

exports.getProfilePage = async(req, res, next) => {

    const defaultAzureCredential = new DefaultAzureCredential();

    try {

        // get app's access token scoped to Microsoft Graph
        const tokenResponse = await defaultAzureCredential.getToken("https://graph.microsoft.com/.default");

        // get user's access token scoped to Microsoft Graph from session
        // use token to create Graph client
        const graphClient = graphHelper.getAuthenticatedClient(req.session.protectedResources["graphAPI"].accessToken);

        // return profiles of users in Graph
        const users = await graphClient
            .api('/users')
            .get();

        res.render('users', { user: req.session.user, users: users });  
    } catch (error) {
        next(error);
    }
}