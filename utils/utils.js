const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});

const s3 = new aws.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;


const taxSlabs = [
    { minSalary: 0, maxSalary: 50000, taxRate: 0 },
    { minSalary: 50001, maxSalary: 75000, taxRate: 0.05 },
    { minSalary: 75001, maxSalary: 100000, taxRate: 0.1 },
    { minSalary: 100001, maxSalary: 150000, taxRate: 0.15 },
    { minSalary: 150001, maxSalary: 250000, taxRate: 0.175 },
    { minSalary: 250001, maxSalary: 350000, taxRate: 0.2 },
    { minSalary: 350001, maxSalary: Infinity, taxRate: 0.225 }
];




module.exports = {

    // BASE 64 TO PDF
    async base64ToPdf(file) {
        const splitPdf = file.split(",");
        const base64File = splitPdf[1];
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'pdf';

        const fileName = `pdf_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fsPromise.writeFile(filePath, buffer);
        return filePath;
    },

    // BASE 64 TO JPEG
    // async base64ToJpg(file) {
    //     try {
    //         const splitJpg = file.split(",");
    //         const base64File = splitJpg[1]; // Take the second element after splitting
    //         const buffer = Buffer.from(base64File, "base64");
    //         const defaultExtension = "jpeg";

    //         const fileName = `jpg_file${Date.now()}.${defaultExtension}`;
    //         const filePath = path.join(__dirname, "../uploads", fileName);

    //         await fsPromise.writeFile(filePath, buffer);
    //         return filePath;
    //     } catch (error) {
    //         console.error("Error converting base64 to jpg:", error);
    //         throw error; // Re-throw the error for proper error handling in the calling code
    //     }
    // },

    async base64ToJpg(base64String) {
        try {
            const splitBase64 = base64String.split(",");
            const base64Data = splitBase64[1]; // Extract base64 content after header
            const buffer = Buffer.from(base64Data, "base64"); // Create buffer directly from base64
            return buffer; // Return the buffer
        } catch (error) {
            console.error("Error converting base64 to JPG:", error);
            throw error;
        }
    },


    async uploadToS3(base64String, fileName) {
        try {
            const buffer = await this.base64ToJpg(base64String);
            const params = {
                Bucket: BUCKET_NAME,
                Key: `uploads/${fileName}`, // Specify the folder in the bucket
                Body: buffer, // Use the buffer directly
                ContentType: "image/jpeg",
            };

            const uploadResult = await s3.upload(params).promise();
            return uploadResult.Location; // Return the file URL
        } catch (error) {
            console.error("Error uploading file to S3:", error);
            throw error;
        }
    },


    convertFileIntoBase64: (filename) => {
        try {
            const filePath = path.join(__dirname, "../uploads", filename);

            function base64_encode(file) {
                const bitmap = fs.readFileSync(file);
                return Buffer.from(bitmap).toString("base64");
            }

            const base64File = base64_encode(filePath);
            return base64File;
        } catch (error) {
            console.error(error);
        }
    },

    extractFilenameFromURL: (url) => {
        const parts = url.split('\\');
        return parts[parts.length - 1];
    },

    // GET TIME IN ET TIME ZONE
    getCurrentDateTimeInET: () => {
        const currentDate = new Date();
        // Convert to UTC
        const utcDate = new Date(currentDate.toUTCString());
        const etOffset = -4 * 60; // UTC-4 for Eastern Time (ET)
        const etDate = new Date(utcDate.getTime() + etOffset * 60000);
        const hours = etDate.getUTCHours();

        return etDate;
    },

    getCurrentDateTimeWithTimeZone: () => {
        const currentDate = new Date();
        // Extract time zone offset in minutes
        const fullDate = currentDate.toLocaleString('en-US', { timeZoneName: 'short' });
        function getTimeZone(date) {
            const dateString = date;

            // Regular expression to match the time zone abbreviation
            const timeZoneRegex = /\b([A-Z]{3,4})\b/;

            // Extract time zone
            const timeZoneMatch = dateString.match(timeZoneRegex);
            const timeZone = timeZoneMatch ? timeZoneMatch[1] : null;
            return timeZone
        }
        const timeZone = getTimeZone(fullDate)

        return { currentDate, timeZone }

    },


    // CONVERT TIME TO EST
    convertToEST: (date_time, timezone) => {
        const etOffset = -4 * 60; // Offset for Eastern Time (ET) in minutes

        // Check if the timezone is already Eastern Time (ET)
        if (timezone === 'EST' || timezone === 'EDT') {
            return date_time;
        }

        // Convert to UTC time
        const utcTime = new Date(date_time.getTime() + date_time.getTimezoneOffset() * 60000);

        // Convert to Eastern Time (ET)
        const estTime = new Date(utcTime.getTime() + etOffset * 60000);

        return estTime;
    },


    sendEmail: async (publicFormUrl, Fullname, email) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                    }
                    h1 {
                        color: #0044cc;
                    }
                    p {
                        margin: 0.5em 0;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 0.9em;
                        color: #666666;
                    }
                </style>
            </head>
            <body>
                <h1>Welcome to EternaTrust Insurance Group!</h1>
                <p>Dear ${Fullname},</p>
                <p>We are thrilled to see your interest in joining the EternaTrust Insurance Group family! At EternaTrust, we pride ourselves on empowering agents like you to excel in providing exceptional service to clients and building a rewarding career.</p>
                <p>To officially begin your journey with us, we’ve streamlined the onboarding process. Simply click the link below to access and complete your onboarding form:</p>
                <p><a href="${publicFormUrl}" target="_blank">Complete Your Onboarding Here</a></p>
                <p>This step will help us set everything up to ensure you have all the tools, resources, and support you need to succeed with EternaTrust.</p>
                <p>If you have any questions or need assistance with the onboarding process, don’t hesitate to reach out to our support team at <a href="mailto:support@eternatrust.com">support@eternatrust.com</a> or call us at [support number].</p>
                <p>We’re excited to welcome you aboard and look forward to achieving great milestones together!</p>
                <p class="footer">
                    Warm regards,<br>
                    <strong>The Onboarding Team</strong><br>
                    EternaTrust Insurance Group<br>
                    <a href="http://www.eternatrustgroup.com" target="_blank">http://www.eternatrustgroup.com</a>
                </p>
            </body>
            </html>
        `;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            },
            tls: { rejectUnauthorized: false },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Welcome to EternaTrust Insurance Group – Let’s Get Started!',
            html: html
        };

        // Send the email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    },



    calculateMonthlyTax: async (monthlySalary) => {
        // Calculate annual salary
        // const annualSalary = monthlySalary * 12;

        // Calculate tax for annual salary
        let tax = 0;
        let monthlyTax;

        for (const slab of taxSlabs) {
            if (monthlySalary > slab.maxSalary) {
                tax += (slab.maxSalary - slab.minSalary + 1) * slab.taxRate;
            } else if (monthlySalary >= slab.minSalary && monthlySalary <= slab.maxSalary) {
                tax += (monthlySalary - slab.minSalary + 1) * slab.taxRate;
                break;
            }
        }
        // monthlyTax = tax / 12;
        // Return monthly tax amount
        return tax
    },

    getCurrentMonthYear: async () => {
        const currentDate = new Date();

        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        // Extracting the current day, month, and year
        const currentDay = currentDate.getDate();
        const Day = 28
        const currentMonthNumber = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let monthNumber = currentMonthNumber;
        let year = currentYear;

        // Increment month if current day is 28
        // if (Day === 28) {
        if (currentDay === 28) {
            monthNumber = (currentMonthNumber + 1) % 12; // Increment month (roll over if December)
            if (monthNumber === 0) {
                year++; // Increment year if it rolls over to January of the following year
            }
        }

        const monthName = monthNames[monthNumber];

        return { monthName, year }; // Returning as an object
    }


}
