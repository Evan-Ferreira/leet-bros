import axios from 'axios';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const EVAN_PHONE_NUMBER = process.env.EVAN_PHONE_NUMBER;
const GAVIN_PHONE_NUMBER = process.env.GAVIN_PHONE_NUMBER;
const JOSEPH_PHONE_NUMBER = process.env.JOSEPH_PHONE_NUMBER;

const EVAN_LEETCODE = process.env.EVAN_LEETCODE;
const JOSEPH_LEETCODE = process.env.JOSEPH_LEETCODE;
const GAVIN_LEETCODE = process.env.GAVIN_LEETCODE;

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const gavinLoss = [
    "This is why you and Wendy didn't date. {results} just surpassed you in Leetcode points",
    "You're a disgrace to your family. {results} just surpassed you in Leetcode points",
    'Your fired from inQUbate. {results} just surpassed you in Leetcode points',
    "This is why Shopify didn't hire you. {results} just surpassed you in Leetcode points",
    'Like your stomach, your leetcode is trash. {results} just surpassed you in Leetcode points',
];

const JosephLoss = [
    "This is why she's never coming back. {results} just surpassed you in Leetcode points",
    "This is why Scotiabank didn't hire you. {results} just surpassed you in Leetcode points",
    'Remember when you broke a TV in the Pilot House. {results} just surpassed you in Leetcode points',
    'Worms and mole rats are unemployed. {results} just surpassed you in Leetcode points',
    "You'll never surpass William Wang. {results} just surpassed you in Leetcode points",
];

const evanLoss = [
    '{results} just surpassed you in Leetcode points',
    '{results} just surpassed you in Leetcode points',
    '{results} just surpassed you in Leetcode points',
    '{results} just surpassed you in Leetcode points',
    '{results} just surpassed you in Leetcode points',
];

const win = [
    'You are currently ranked the highest on LeetCode! Welcome back, king 👑.',
];

function getRandomInteger() {
    return Math.floor(Math.random() * 5);
}

async function getLeetCodeData(apiUrl) {
    try {
        const response = await axios.get(apiUrl);
        const leetInfo = {
            totalSolved: response.data.totalSolved,
            easySolved: response.data.easySolved,
            mediumSolved: response.data.mediumSolved,
            hardSolved: response.data.hardSolved,
            ranking: response.data.ranking,
        };
        return leetInfo;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
    }
}

const compareAndRank = (evanRank, gavinRank, josephRank) => {
    if (evanRank > gavinRank && evanRank > josephRank) {
        return 'Evan';
    } else if (gavinRank > evanRank && gavinRank > josephRank) {
        return 'Gavin';
    } else {
        return 'Joseph';
    }
};

async function compareAndNotify() {
    const evanData = await getLeetCodeData(EVAN_LEETCODE);
    const gavinData = await getLeetCodeData(GAVIN_LEETCODE);
    const josephData = await getLeetCodeData(JOSEPH_LEETCODE);
    const results = compareAndRank(
        Number(evanData.ranking),
        Number(gavinData.ranking),
        Number(josephData.ranking)
    );
    const randomInteger = getRandomInteger();
    if (results === 'Gavin') {
        const evanMessage = gavinLoss[randomInteger];
        const josephMessage = josephLoss[randomInteger];
        const gavinMessage = win[0];
        sendSMS(evanMessage, EVAN_PHONE_NUMBER);
        sendSMS(josephMessage, JOSEPH_PHONE_NUMBER);
        sendSMS(gavinMessage, GAVIN_PHONE_NUMBER);
    } else if (results === 'Joseph') {
        const evanMessage = josephLoss[randomInteger];
        const josephMessage = win[0];
        const gavinMessage = gavinLoss[randomInteger];
        sendSMS(evanMessage, EVAN_PHONE_NUMBER);
        sendSMS(josephMessage, JOSEPH_PHONE_NUMBER);
        sendSMS(gavinMessage, GAVIN_PHONE_NUMBER);
    } else {
        const evanMessage = win[0];
        const josephMessage = josephLoss[randomInteger];
        const gavinMessage = gavinLoss[randomInteger];
        sendSMS(evanMessage, EVAN_PHONE_NUMBER);
        sendSMS(josephMessage, JOSEPH_PHONE_NUMBER);
        sendSMS(gavinMessage, GAVIN_PHONE_NUMBER);
    }
}

function sendSMS(messageBody, FRIEND_PHONE_NUMBER) {
    client.messages
        .create({
            body: messageBody,
            from: TWILIO_PHONE_NUMBER,
            to: FRIEND_PHONE_NUMBER,
        })
        .then((message) => console.log(`SMS sent: ${message.sid}`))
        .catch((error) => console.error('Error sending SMS:', error));
}

compareAndNotify();
