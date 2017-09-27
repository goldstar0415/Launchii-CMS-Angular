var express = require('express'),
    app = express();

app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendfile('index.html', { root: __dirname })
});

app.get('/ga-reporting-data', function(req, res) {
    var reportType = req.query.type || 'basic';
    var viewID = process.env.ga_view_id;
    var dateRange = parseInt(process.env.ga_date_range);
    dateRange = isNaN(dateRange) ? 0 : dateRange;

    var googleAPI = require('googleapis');
    var client_email = process.env.ga_client_email;
    var private_key = process.env.ga_private_key;
    var jwtClient = new googleAPI.auth.JWT(client_email, null, private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null);
    var oauth2Client = new googleAPI.auth.OAuth2();

    jwtClient.authorize(function(err, result) {
        if (err) {
            res.send(JSON.stringify({error: 'Unauthorized'}));
            return;
        }

        oauth2Client.setCredentials({
            access_token: result.access_token
        });

        var analytics = googleAPI.analyticsreporting('v4');
        googleAPI.options({ auth: oauth2Client });

        var req = null;

        if (reportType === 'traffic') {

            req = {
                reportRequests: [
                    {
                        viewId: viewID,
                        dateRanges: [
                            {
                                startDate: dateRange == 1 ? '7daysAgo' : '30daysAgo',
                                endDate: 'yesterday',
                            }
                        ],
                        metrics: [
                            { expression: 'ga:sessions' }
                        ],
                        dimensions: [
                            { name: 'ga:channelGrouping' }
                        ],
                        samplingLevel: 'LARGE'
                    }
                ]
            };

        } else if (reportType == 'traffic-per-device') {

            req = {
                reportRequests: [
                    {
                        viewId: viewID,
                        dateRanges: [
                            {
                                startDate: dateRange == 1 ? '7daysAgo' : '30daysAgo',
                                endDate: 'yesterday',
                            }
                        ],
                        metrics: [
                            { expression: 'ga:sessions' },
                            { expression: 'ga:users' },
                            { expression: 'ga:bounceRate' },
                            { expression: 'ga:avgSessionDuration' },
                            { expression: 'ga:goal3Completions' },
                            { expression: 'ga:goal2Completions' },
                            { expression: 'ga:goal5Completions' }
                        ],
                        dimensions: [
                            { name: 'ga:deviceCategory' }
                        ],
                        samplingLevel: 'LARGE'
                    }
                ]
            };

        } else {

            req = {
                reportRequests: [
                    {
                        viewId: viewID,
                        dateRanges: [
                            {
                                startDate: dateRange == 1 ? '7daysAgo' : '30daysAgo',
                                endDate: 'yesterday',
                            }
                        ],
                        metrics: [
                            { expression: 'ga:users' },
                            { expression: 'ga:sessions' },
                            { expression: 'ga:avgSessionDuration' },
                            { expression: 'ga:metric1' },
                            { expression: 'ga:goal1Completions' },
                            { expression: 'ga:goal2Completions' }
                        ],
                        dimensions: [
                            { name: 'ga:date' }
                        ],
                        samplingLevel: 'LARGE'
                    }
                ]
            };

        }

        var request = {
            'headers': { 'Content-Type': 'application/json' },
            'auth': oauth2Client,
            'resource': req
        };

        //Request data to GA API
        analytics.reports.batchGet(
            request,
            function (err, response) {
                if (err) {
                    console.log(err);
                    var errMsg = 'Something went wrong.';
                    if (err && err.errors && err.errors[0] && err.errors[0].message) {
                        errMsg = err.errors[0].message;
                    }
                    res.send(JSON.stringify({error: errMsg}));
                } else {
                    res.send(JSON.stringify(response));
                }
            }
        );
    });
});

app.get('/ga-date-range', function(req, res) {
    var dateRange = parseInt(process.env.ga_date_range);
    dateRange = isNaN(dateRange) ? 0 : dateRange;

    var today = new Date();
    var startDate = new Date(today.getTime() - ((dateRange == 1 ? 7 : 30) * 24 * 60 * 60 * 1000));
    var endDate = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000));        // end date is yesterday

    var dds = startDate.getDate();
    var mms = startDate.getMonth() + 1; //January is 0!
    var yyyys = startDate.getFullYear();
    if (dds < 10) {
        dds = '0' + dds;
    }
    if (mms < 10) {
        mms = '0' + mms;
    }
    var startDateString = dds + '/' + mms + '/' + yyyys;

    var dde = endDate.getDate();
    var mme = endDate.getMonth() + 1; //January is 0!
    var yyyye = endDate.getFullYear();
    if (dde < 10) {
        dde = '0' + dde;
    }
    if (mme < 10) {
        mme = '0' + mme;
    }
    var endDateString = dde + '/' + mme + '/' + yyyye;

    var resultString = (dateRange == 1 ? 'Last 7 days ' : 'Last 30 days ') + '(' + startDateString + ' - ' + endDateString + ')';

    res.send(JSON.stringify({result: resultString}));
});

app.get('/froala-s3-info', function(req, res) {
    var Base64 = require('js-base64').Base64;
    var crypto = require('crypto');

    var bucketName = process.env.froala_s3_bucket_name || "";
    var bucketRegion = process.env.froala_s3_bucket_region || "";
    var accessKeyId = process.env.froala_s3_access_key_id || "";
    var secretAccessKey = process.env.froala_s3_secret_key || "";

    var currentDate = new Date();
    var expirationDate = currentDate;
    expirationDate.setHours(currentDate.getHours() + 10);
    var policyData = {
        expiration: expirationDate.toISOString(),
        conditions: [
            ["starts-with", "$key", "uploads/"],
            ["starts-with", "$x-requested-with", "xhr"],
            ["content-length-range", 0, 20971520],
            ["starts-with", "$content-type", ""],
            {bucket: bucketName},
            {acl: "public-read"},
            {success_action_status: "201"}
        ]
    };

    var policyString = Base64.encode(JSON.stringify(policyData)).replace("\n", "");
    var signature = crypto.createHmac("sha1", secretAccessKey).update(policyString).digest('base64').replace("\n", "");

    res.send(JSON.stringify({result: {bucket: bucketName, region: bucketRegion, aws_access_key_id: accessKeyId, policy: policyString, signature: signature}}));
});

var server = app.listen(process.env.PORT || 8080);
