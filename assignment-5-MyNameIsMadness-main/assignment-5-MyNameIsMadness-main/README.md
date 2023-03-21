# Artistic Rendering

GLSL shaders make it possible for us to create some amazing lighting effects in real- time computer graphics. These range from photorealistic lighting to artistically inspired non-photorealistic rendering, as featured in games like *The Legend of Zelda: The Wind Waker* and *Team Fortress 2*. 

By completing this project I learned:
- How to calculate realistic and artistic per-pixel lighting in real-time.
- How to modify geometry on the fly to create viewpoint-dependent effects such as silhouette edges.
- How to implement and use your own shader programs!

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

## GopherGfx

The base program for this assignment is implemented using GopherGfx, a high-level graphics library developed by Evan Suma Rosenberg. 

## Further Reading

Mitchell, Francke, and Eng, [Illustrative Rendering in Team Fortress 2](https://valvearchive.com/archive/Other%20Files/Publications/NPAR07_IllustrativeRenderingInTeamFortress2.pdf), *Non- Photorealistic and Artistic Rendering*, 2007. 

Gooch, Gooch, Shirley, and Cohen, [A Non-Photorealistic Lighting Model for Automatic Technical Illustration](https://users.cs.northwestern.edu/~ago820/SIG98/abstract.html), *SIGGRAPH*, 1998. 

Card and Mitchell, [Non-Photorealistic Rendering with Pixel and Vertex Shaders](http://developer.amd.com/wordpress/media/2012/10/ShaderX_NPR.pdf), *ShaderX: Vertex and Pixel Shaders Tips and Tricks*, 2002.

## Acknowledgments

This project was based on content from CSCI 4611 Fall 2021 by [Daniel Keefe](https://www.danielkeefe.net/).

This project was completed for [CSCI 4611 Spring 2022](https://canvas.umn.edu/courses/290928/assignments/syllabus) by [Evan Suma Rosenberg](https://illusioneering.umn.edu/) is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
