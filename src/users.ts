import { getData, setData } from './dataStore';
import { getUserId, isValidToken } from './global';
import {
  validName, validEmail, anotherUserEmail, alphanumeric,
  isValidHandleLength, anotherUserHandle, hashOf
} from './global';
import HTTPError from 'http-errors';
import request from 'sync-request';
import fs from 'fs';
import getImageSize from 'image-size-from-url';
import config from './config.json';
const PORT: number = parseInt(process.env.PORT || config.port);

const Jimp = require('jimp') ;

async function crop(xStart, yStart, xEnd, yEnd, uId) { // Function name is same as of file name
  const data = getData();
  // Reading Image
  const image = await Jimp.read
  ('static/img.jpg');
  // Generating random string for url
  const randostr = generateString(20);
  // Cropping image and saving it to static folder
  image.crop(xStart, yStart, xEnd, yEnd)
  .write(`static/${randostr}.jpg`);
  // Assigining users .profileImgUrl to the url generated
  data.users[uId].profileImgUrl = `https://localhost:${PORT}/static/${randostr}.jpg`;
  setData(data);
  return;
}

/**
  * For a valid user, returns information about their user ID, email,
  * first name, last name, and handle
  *
  * @param {string} token - a valid token
  * @param {integer} uId - a valid uId from dataStore
  *
  * @returns {Object {uId: integer, email: string, nameFirst: string,
 * nameLast: string, handleStr: string} } - object user details
 *
 * @returns {error} - return error object in invalid cases
*/

function userProfileV3(token: string, uId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  for (const user of data.users) {
    if (uId === user.uId) {
      return {
        user: {
          uId: uId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleStr: user.handleStr,
        }
      };
    }
  }
  throw HTTPError(400, 'Invalid uId');
}

/**
  * Returns a list of all users and their associated details.
  *
  * @param {string} token - a valid token
  *
  * @returns {Array<user>: {uId: integer, email: string, nameFirst: string,
 * nameLast: string, handleStr: string} } - object user details
 *
 * @returns {error} - return error object in invalid cases
*/

function usersAllV2(token: string) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  const userArr = [];
  for (const user of data.users) {
    if (user.isRemoved) {
      continue;
    }
    userArr.push({
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    });
  }

  return { users: userArr };
}

/**
  * Updates the authorised user's first and last name.
  *
  * @param {string} token - a valid token
  * @param {string} nameFirst - a valid nameFirst
  * @param {string} nameLast - a valid nameLast
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetNameV2(token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  // invalid token
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  // Invalid cases: nameFirst & nameLast > 50 || < 1
  if (!validName(nameFirst) || !validName(nameLast)) {
    throw HTTPError(400, 'Invalid nameFirst/nameLast');
  }

  // change nameFirst and nameLast
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.nameFirst = nameFirst;
      user.nameLast = nameLast;
      break;
    }
  }

  setData(data);
  return {};
}

/**
  * Update the authorised user's email address
  *
  * @param {string} token - a valid token
  * @param {string} email - a valid email
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetEmailV2(token: string, email: string) {
  const data = getData();
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!validEmail(email) || anotherUserEmail(token, email)) {
    throw HTTPError(400, 'Invalid email');
  }

  // change email
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.email = email;
      break;
    }
  }

  setData(data);
  return {};
}

/**
  * Update the authorised user's handle (i.e. display name)
  *
  * @param {string} token - a valid token
  * @param {string} handleStr - a valid handle string
  *
  * @returns {} - empty object
 *
 * @returns {error} - return error object in invalid cases
*/

function userSetHandleV2(token: string, handleStr: string) {
  const data = getData();
  // invalid token, length of handleStr, non-alphanumeric, handle already in use
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!alphanumeric(handleStr) || !isValidHandleLength(handleStr) ||
    anotherUserHandle(token, handleStr)) {
    throw HTTPError(400, 'Invalid handleStr');
  }

  // change handle
  for (const user of data.users) {
    if (user.tokens.includes(hashOf(token))) {
      user.handleStr = handleStr;
      break;
    }
  }

  setData(data);
  return {};
}

async function getDim(url: URL, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  const {width, height} = await getImageSize(`${url}`);
  // Crop inputs aren't within dimensions
  if (xStart > width || yStart > height || xEnd > width || yEnd > height) {
    throw HTTPError(400, 'Invalid crop sizes');
  }
  return;
}

// Generate random string
function generateString(length) {
  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

  return result;
}

function userUploadPhotoV1(token: string, imgUrl: URL, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  // Error throwing
  // Invalid token
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  //  File is not a .jpg file
  if (!(/\.jpg$/.test(`${imgUrl}`))) {
    throw HTTPError(400, 'File is not a jpg file');
  }
  // Calls getDim function for more error testing
  const size = getDim(imgUrl, xStart, yStart, xEnd, yEnd);
  
  // Getting the image
  const ogImg = request(
    'GET',
    `${imgUrl}`
  );

  // Returning error if status not 200
  //if (ogImg.statusCode !== 200) {
  //  throw HTTPError(400, 'Error when retrieving image');
  //}

  // Saving image in static folder
  const body = ogImg.getBody();
  fs.writeFileSync('static/img.jpg', body, { flag: 'w' });

  // Getting the uId for later use when storing data
  const uId = getUserId(token);
  crop(xStart, yStart, xEnd, yEnd, uId);

  return {};  
}

export { userProfileV3, usersAllV2, userSetNameV2, userSetEmailV2, userSetHandleV2, userUploadPhotoV1 };