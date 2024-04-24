#!/usr/bin/env node

import * as utils from "./utils.js";
import colors from "colors";

const main = async () => {
  console.log(colors.green(`Welcome to Youtube Downloader Tool!`));

  while (true) {
    // get the URL of the video
    const url = await utils.get_user_input();

    // validate the URL
    if (!utils.validate_url(url)) {
      console.log(colors.red("Invalid URL! Please enter a valid YouTube URL."));
      continue;
    }

    // get the video quality
    const quality = await utils.get_video_quality();

    // get the video format
    const format = await utils.get_video_format();

    // get the video name
    const name = await utils.get_video_name();

    // download the video
    await utils.download_video(url, quality, format, name);

    //ask the user if they want to download another video
    const answer = await utils.to_be_continued();

    if (answer.toLowerCase() === "no" || answer.toLowerCase() === "n") {
      break;
    }
  }

  console.log(colors.green("Thank you for using Youtube Downloader Tool!"));
};

main();
