var wkhtmltopdf = require('wkhtmltopdf');
var MemoryStream = require('memorystream');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context) {
	var memStream = new MemoryStream();
	var html_utf8 = new Buffer(event.html_base64, 'base64').toString('utf8');
	console.log('event.html_base64', event.html_base64);


	// wkhtmltopdf(html_utf8, event.options, function(code, signal) {
	// 	context.done(null, { pdf_base64: memStream.read().toString('base64') }); })
  wkhtmltopdf(html_utf8, event.options, function(code, signal) {
    var pdf = memStream.read();
    var params = {
      Bucket : "bucketpdfmaker",
      Key : "test.pdf",
      Body : pdf
    }

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
      } else if (params.Body){
        context.done(null, { pdf_base64: pdf.toString('base64') });
      } else {
        console.log('There is no params.Body')
      }
    });
  })
.pipe(memStream);
};