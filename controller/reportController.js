const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path')
const catchAsyncError = require('../utils/catchAsyncError');
const pool = require('../utils/dbConnection');

exports.generateCounterReport = catchAsyncError(async (req, res) => {
  const results = (await pool.request().query(`select * from T_MEMBER WHERE is_voter_slip='1'`)).recordset;
  const counters = await pool.request().query(`select * from T_COUNTER`);
  const allCounters = counters.recordset
  const finalArr = results.map(result => {
    return {
      ...result,
      tx_counter: allCounters.find(el => {
        if (parseInt(result.tx_org_sl) <= el?.ct_max && parseInt(result.tx_org_sl) >= el?.ct_min) {
          return true;
        }
      })?.tx_macro || 'not assign yet',
    }
  })
  let uniqueCounterArr = []
  finalArr.forEach(item => {
    const index = uniqueCounterArr.findIndex(ele => ele.tx_counter === item.tx_counter);
    if (index !== -1) {
      const findObj = { tx_counter: uniqueCounterArr[index].tx_counter, tx_org_id: [...uniqueCounterArr[index].tx_org_id, item.tx_org_id] };
      uniqueCounterArr[index] = findObj;
    } else {
      uniqueCounterArr.push({
        tx_counter: item.tx_counter,
        tx_org_id: [item.tx_org_id]
      })
    }
  })
  const fResult = uniqueCounterArr.map(el => {
    return {
      ...el, noOfVoter: el.tx_org_id.length
    }
  })
  console.log(fResult)
  try {
    // Render the HTML template with EJS
    const htmlContent =
      `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Counter Report</title>

            <style>
              .page {
                  page-break-after: always;
                  margin-top: 3rem;
              }
              .table{
                width: 100%;
                border-collapse: collapse;
              }
              td{
                border: 1px solid black;
                font-weight:600;
              }
              thead{
                border: 1px solid black;
                height: 2rem;
              }
              thead tr td{
                border: 1px solid black;
                padding-left:1rem;
                font-size:26px;
              }
              tbody tr td{
                text-aligh:center;
                padding-left: 1rem;
                height:2rem;
              }
              h1{
                display:flex;
                justify-content:center;
                text-decoration: underline;
                margin-bottom:3rem;
              }
            </style>

        </head>
        <body>
          <div class = "page">
            <div class = "container">
              <div>
                <p style = "text-decoration:underline">Report Generated D&T: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <h1>Counterwise issued members No.</h1>
                <table class = 'table'>
                  <thead>
                    <tr>
                      <td>Counter Name</td>
                      <td>No of Issued Members</td>
                    </tr>
                  </thead>
                  <tbody>
                    ${fResult.map(el => {
                      return (
                        `
                          <tr>
                            <td>${el.tx_counter}</td>
                            <td>${el.noOfVoter}</td>
                          </tr>
                        `
                      )
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </body>
      </html>`
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
                    
    // Set timeouts
    page.setDefaultNavigationTimeout(60000); // Set timeout to 60 seconds
    page.setDefaultTimeout(60000); // Set timeout to 60 seconds
    
    // Set the content of the page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate a PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Close Puppeteer
    await browser.close();

    // Set response headers and send the PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
})