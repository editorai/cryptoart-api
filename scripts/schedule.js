const schedule = require('node-schedule');
const exec = require('child_process').exec;

function startSchedule(){

    if(process.env.ENV == 'production') {

        console.log('Start Schedule at ' + new Date());
        var rule = '0    *    *    *    *    *';

        schedule.scheduleJob(rule, function(){
            console.log('-------------' + new Date() + ' for download2DB-pro-------------');
            exec('npm run download2DB-pro', function(err, stdout, stderr){
                if(err) {
                    console.log('Error:' + stderr);
                } else {
                    console.log(stdout);
                }
            });
        }); 
    }
    else {

        console.log('Start Schedule at ' + new Date());
        var rule = '0    *    *    *    *    *';

        schedule.scheduleJob(rule, function(){
            console.log('-------------' + new Date() + ' for download-------------');
            exec('npm run download', function(err, stdout, stderr){
                if(err) {
                    console.log('Error:' + stderr);
                } else {
                    console.log(stdout);
                }
            });

            // exec('npm run download2DB', function(err, stdout, stderr){
            //     if(err) {
            //         console.log('Error:' + stderr);
            //     } else {
            //         console.log(stdout);
            //     }
            // });
        }); 
    }
}

startSchedule();
