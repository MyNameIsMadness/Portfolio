# So You Think Ants (Robots) Can Dance

What I learned during this project:
- How transformations can be composed in a hierarchy to create a scene graph and/or, in this case, an animated character within a scene.
- How transformations can be used to scale, rotate, and translate basic shapes (unit cubes, spheres, cylinders, and cones) into more complex scenes and characters.
- How mocap data can be used and manipulated in multiple ways to create different types of animations. For example:
  - How to create a looping animation that smoothly interpolates between the beginning of the motion clip and the end to avoid any discontinuities.
  - How to overlay new motion clips onto a character at runtime, for example, making your character jump in a game when you press a button, or in our case, perform one of a series of cool ballet moves.
- How to read and extend some fairly sophisticated computer graphics code.

## Prerequisites

To work with this code, you will first need to install [Node.js](https://nodejs.org/en/) and [Visual Studio Code](https://code.visualstudio.com/). 

After cloning your repository:

```
npm install
```

This will create a `node_modules` folder in your directory and download all the dependencies needed to run the project.  Note that this folder is `.gitignore` file and should not be committed to your repository.  After that, you can compile and run a server with:

```
npm run start
```

The build system should launch your program in a web browser automatically.  If not, you can run it by pointing your browser at `http://localhost:8080`.

## Data

The CMU Mocap database contains 2,605 different motions, most recorded at 120Hz, but some recorded at 60Hz or other speeds. These motions range from the simple (person walking straight forward), to the complicated (directing traffic), to the silly (someone doing the "I'm a little teapot" dance).

The motions in the CMU database use skeletons specified in .asf files and separate motions specified in .amc files. The .asf files specify bone names, directions, lengths, and the skeleton hierarchy for one specific human subject who came to the mocap lab. That person likely performed several motions during the capture session, so there is typically one .asf file for multiple .amc files. The subjects are numbered (e.g., subject #50). and the skeleton files are named accordingly (e.g., 50.asf). Motion filenames start with the subject ID, then have an underscore, then the number of the motion (e.g., 50_01.amc is the first motion captured for subject 50). The support code comes with the data files we used in our solution to the assignment, but it can be fun to swap in other motions by downloading other .asf and corresponding .amc files from the [CMU database](http://mocap.cs.cmu.edu/).  

If you are interested, you can also read more about the [Acclaim Motion Capture](http://graphics.cs.cmu.edu/nsp/course/cs229/info/ACCLAIMdef.html) data format used by the mocap files.

## Acknowledgments

This code was based on content from CSCI 4611 Fall 2021 by [Daniel Keefe](https://www.danielkeefe.net/).

This project was completed for [CSCI 4611 Spring 2022](https://canvas.umn.edu/courses/290928/assignments/syllabus) by [Evan Suma Rosenberg](https://illusioneering.umn.edu/) is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
