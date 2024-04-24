// utils.js
import inquirer from "inquirer";
import ytdl from "ytdl-core";
import fs from "fs";
import os from "os";

export const get_user_input = async () => {
  const questions = [
    {
      type: "input",
      name: "url",
      message: "Enter the URL of the video you want to download:",
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.url;
};

export const validate_url = (url) => {
  const url_pattern = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return url_pattern.test(url);
};

export const get_video_quality = async () => {
  const questions = [
    {
      type: "list",
      name: "quality",
      message: "Select the video quality:",
      choices: ["Highest", "Lowest"],
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.quality;
};

export const get_video_format = async () => {
  const questions = [
    {
      type: "list",
      name: "format",
      message: "Select the video format:",
      choices: ["mp4", "webm"],
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.format;
};

export const get_video_name = async () => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the name of the video:",
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.name;
};

export const download_video = async (url, quality, format, name) => {
  try {
    const video = ytdl(url, {
      quality: quality === "Highest" ? "lowest" : "highest",
    });

    video.on("progress", (chunk, downloaded, total) => {
      show_progress(chunk, downloaded, total);
    });

    video.on("end", async () => {
      show_success(name);
      return;
    });

    // Get the user's home directory
    const homeDirectory = os.homedir();

    // console.log(homeDirectory);

    // Define the path to the Downloads folder
    const downloadsFolder = `${homeDirectory}\\Downloads`; // On Windows, backslashes are used to separate directories

    // Modify the line to save the video in the Downloads folder
    video.pipe(fs.createWriteStream(`${downloadsFolder}\\${name}.${format}`));
  } catch (error) {
    throw new Error("An error occurred while downloading the video.");
  }
};

export const show_progress = (chunk, downloaded, total) => {
  const percentage = (downloaded / total) * 100;
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Downloading... ${percentage.toFixed(2)}%`);
};

export const show_success = (name) => {
  console.log(`\n${name} downloaded successfully!`);
};

export const to_be_continued = async () => {
  const questions = [
    {
      type: "input",
      name: "answer",
      message: "Do you want to download another video? (yes/no)",
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.answer;
};
