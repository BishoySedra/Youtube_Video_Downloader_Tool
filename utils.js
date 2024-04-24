import inquirer from "inquirer";
import ytdl from "ytdl-core";
import fs from "fs";
import colors from "colors";

// function to get user input and return the URL
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

// function to validate the URL
export const validate_url = (url) => {
  const url_pattern = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return url_pattern.test(url);
};

// function to get user input for the video quality
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

// function to get user input for the video format
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

// function to get user input for the video name
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

// function to download the video
export const download_video = async (url, quality, format, name) => {
  const video = ytdl(url, {
    quality: quality === "Highest" ? "highest" : "lowest",
  });

  video.on("progress", (chunk, downloaded, total) => {
    show_progress(chunk, downloaded, total);
  });

  video.on("end", async () => {
    show_success(name);
    return;
  });

  video.on("error", (error) => {
    show_error(error);
    return;
  });

  video.pipe(fs.createWriteStream(`${name}.${format}`));
};

// function to display the progress of the download
export const show_progress = (chunk, downloaded, total) => {
  const percentage = (downloaded / total) * 100;
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Downloading... ${percentage.toFixed(2)}%`);
};

// function to display the success message
export const show_success = (name) => {
  console.log(`\n${name} downloaded successfully!`);
};

// function to display the error message
export const show_error = (error) => {
  console.log(colors.red("Invalid URL! Please enter a valid YouTube URL."));
};

// function to get the user input for downloading another video
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
