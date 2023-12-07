import ytdl from "ytdl-core";
import fs from "fs";
import inquirer from "inquirer";
import colors from "colors";

async function get_user_input() {
    try {
        const url_input = await inquirer.prompt([
            {
                type: 'input',
                name: 'videoURL',
                message: 'Enter YouTube video URL: ',
                validate: function (value) {
                    // Validate that the entered value is a valid YouTube video URL
                    const isValidURL = ytdl.validateURL(value);
                    return isValidURL ? true : 'Please enter a valid YouTube video URL.';
                },
            }
        ]);

        const desired_url = url_input.videoURL;

        // get video info
        const info = await get_video_info(desired_url);

        // console.log(info);

        const qualityOptions = [...new Set(info.formats.map(format => ({ qualityLabel: format.qualityLabel, hasVideo: format.hasVideo, hasAudio: format.hasAudio })).filter(format => format.hasAudio && format.hasVideo).map(format => format.qualityLabel))];

        // console.log(qualityOptions);

        const quality_input = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedQuality',
                message: 'Select the video quality:',
                choices: qualityOptions,
            },
        ]);

        const desired_quality = quality_input.selectedQuality;

        await download_video(info, desired_quality);

    } catch (error) {
        // console.log(`Something went wrong, please try again!`);
        get_user_input();
    }

}

async function get_video_info(url) {

    try {

        const video_info = await ytdl.getInfo(url, (err, info) => {
            if (err) {
                throw new Error(err);
            }

            return info;
        });

        return video_info;

    } catch (error) {

        console.log(`${error.message},`, `please enter a valid URL!`);

    }
}

async function download_video(info, quality) {

    try {

        // Find the format with the selected quality
        const chosenFormat = info.formats.find(format => format.qualityLabel === quality);

        if (!chosenFormat) {
            throw new Error("This video can't be downloaded, please try again!");
        }

        // Download the video with the chosen format
        const stream = ytdl.downloadFromInfo(info, { format: chosenFormat });

        stream.pipe(fs.createWriteStream(`${info.videoDetails.title}.mp4`));

        console.log(`Video downloaded successfully!`);

    } catch (error) {

        console.log(error.message);
        get_user_input();

    }
}

function main() {
    console.log(colors.green(`Welcome to Youtube Downloader Tool!`));
    get_user_input();
}

main();