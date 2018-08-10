const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const main = require('./scripts/getClasses');

app.use(bodyParser.json());
app.use(cors());

app.listen(8000, () => {
    console.log('Listening to 8000');
});

app.route('/api/course').post((req, res) => {
    console.log("Recieved call to api/course")
    if (req.body.freeTime == undefined)
        req.body.freeTime = null;

    main(req.body.criteria, req.body.freeTime).then((data) => {
        if (data.length > 0 && data[0].length > 0) {
            res.send({
                success: true,
                result: data
            });
        }
        else {
            res.send({
                success: false,
                result: "No match schedule."
            })
        }
        console.log("Returned data from api/course\n")
    });
});