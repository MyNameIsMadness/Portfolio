#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cmath>
#include <bits/stdc++.h>
#define PI 3.14159265
using namespace std;

// Initializing all the structs and functions I will use in main

struct vec3 {
    float x = 0.0f, y = 0.0f, z = 0.0f; 
    vec3() {
        x = 0.0f;
        y = 0.0f;
        z = 0.0f;
    }
    vec3(float x, float y, float z): x(x), y(y), z(z) {}
    vec3 operator+(vec3 other) {
        return vec3((x + other.x), (y + other.y), (z + other.z));
    }
    vec3 operator-(vec3 other) {
        return vec3((x - other.x), (y - other.y), (z - other.z));
    }
    vec3 operator*(float a) {
        return vec3((x * a), (y * a), (z * a));
    }
    vec3 operator/(float a) {
        return vec3((x / a), (y / a), (z / a));
    }
}; 

struct vec4 {
    float x = 0.0f, y = 0.0f, z = 0.0f, w = 0.0f;
    vec4(float x, float y, float z, float w): x(x), y(y), z(z), w(w) {}
    vec4() {
        x = 0.0f;
        y = 0.0f;
        z = 0.0f;
        w = 0.0f;
    }
};

string toString(vec3 v) {
    return "x: " + to_string(v.x) + " y: " + to_string(v.y) + " z: " + to_string(v.z);
}

struct Color {
    float r = 0.0f, g = 0.0f, b = 0.0f;
    Color() {
        r = 0.0f;
        g = 0.0f;
        b = 0.0f;
    }
    Color(float r, float g, float b): r(r), g(g), b(b) {}
};

string toString(Color c) {
    return "r: " + to_string(c.r) + " g: " + to_string(c.g) + " b: " + to_string(c.b);
}

struct MaterialColor {
    Color diffusecolor = Color(); 
    Color spechighcolor = Color(); 
    float ka = 0.0f, kd = 0.0f, ks = 0.0f, n = 0.0f;
    MaterialColor() {
        diffusecolor = Color();
        spechighcolor = Color();
        ka, kd, ks, n = 0.0f;
    }
    MaterialColor(Color diffusecolor, Color spechighcolor, float ka, float kd, float ks, float n): diffusecolor(diffusecolor), spechighcolor(spechighcolor), ka(ka), kd(kd), ks(ks), n(n) {}

    void to_string()
    {
        printf("\tDiffuse: %f %f %f\t Specular: %f %f %f\t ka: %f kd: %f ks: %f n: %f\n",
                diffusecolor.r, diffusecolor.g, diffusecolor.b,spechighcolor.r, spechighcolor.g, spechighcolor.b,
                ka, kd, ks, n);
    }
};

struct Sphere {
    float x = 0.0f, y = 0.0f, z = 0.0f, r = 0.0f;
    Sphere(float x, float y, float z, float r):x(x), y(y), z(z), r(r) {}
    Sphere() {}
    MaterialColor materialcolor = MaterialColor();
};

struct Pixel { 
    Color c = Color();
    vec3 pos = vec3(); 
};

struct Ray {
    vec3 origin = vec3(), direction = vec3();
    Ray(vec3 origin, vec3 direction): origin(origin), direction(direction) {}
    Ray() {
        origin = vec3();
        direction = vec3();
    }
};

string toString(Ray r) {
    return "o: " + toString(r.origin) + " d: " + toString(r.direction);
}

vec3 SphereIntersectPoint(vec3 origin, vec3 direction, float t) {
    return origin + (direction * t);
}

vec3 crossProduct(vec3 a, vec3 b) {
    vec3 c;
    c.x = (a.y * b.z) - (a.z * b.y);
    c.y = (a.z * b.x) - (a.x * b.z);
    c.z = (a.x * b.y) - (a.y * b.x);
    return c;
}

float magnitude(vec3 a) {
    return sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
}

float dotProduct(vec3 a, vec3 b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

vec3 normalize(vec3 a) {
    float mag = magnitude(a);
    vec3 b;
    b.x = (a.x)/mag;
    b.y = (a.y)/mag;
    b.z = (a.z)/mag;
    return b;
}

float findB(vec3 o, vec3 d, Sphere s) {
    return 2.0f * (((d.x) * (o.x - s.x)) + ((d.y) * (o.y - s.y)) + ((d.z) * (o.z - s.z)));
}

float findC(vec3 o, Sphere s) {
    return ((o.x - s.x) * (o.x - s.x)) + ((o.y - s.y) * (o.y - s.y)) + ((o.z - s.z) * (o.z - s.z)) - (s.r * s.r);
}

vec3 RayDir(vec3 p, vec3 o) {
    float x = p.x - o.x;
    float y = p.y - o.y;
    float z = p.z - o.z;
    vec3 top = vec3(x, y, z);
    float bot = magnitude(top);
    return top / bot;
}

struct Light {
    vec4 light_vec = vec4();
    Color light_color = Color();
    Light() {
        light_vec = vec4();
        light_color = Color();
    }
    Light(vec4 light_vec, Color light_color): light_vec(light_vec), light_color(light_color) {}

    void to_string()
    {
        printf("\tlight_vec: %f %f %f %f\t Colour: %f %f %f\n",
            light_vec.x, light_vec.y, light_vec.z, light_vec.w, light_color.r, light_color.g, light_color.b);
    }
};

struct Scene {
    vec3 view_dir, up_dir, view_origin, u_init, u, v_init, v;
    vec3 ul, ur, ll, lr, delta_h, delta_v, delta_ch, delta_cv;
    Color bkgcolor;
    float vfov, d, h_vw, aspect_ratio, w_vw;
    int w_imsize, h_imsize;
    vec3 vw_location, ray_dir;
    Ray viewing_ray;
    vector<MaterialColor> materialcolors;
    vector<Sphere> spheres; 
    vector<Light> lights;

    void to_string()
    {
        for(uint32_t i = 0; i < spheres.size(); i++)
        {
            printf("Sphere %d materials:\n", i);
            spheres[i].materialcolor.to_string();
        }   

        for(uint32_t i = 0; i < lights.size(); i++)
        {
            printf("Light %d info:\n", i);
            lights[i].to_string();
        }

    }
};

// Collision detector between ray and sphere
vec4 Collision_Detect(Ray ray, Sphere sphere) {
    vec3 collision = vec3();
    int indicator = 0;
    float a = 1.0f;
    float b = findB(ray.origin, ray.direction, sphere);
    float c = findC(ray.origin, sphere);
    float discriminant = (b * b) - (4.0f * a * c);
    if (discriminant > 0.0f) {
        float t_one = ((-1.0f * b) + sqrt(discriminant)) / (2.0f * a);
        float t_two = ((-1.0f * b) - sqrt(discriminant)) / (2.0f * a);
        if ((t_one > 0.0f) && (t_two > 0.0f)) {
            if (t_one > t_two) {
                collision = SphereIntersectPoint(ray.origin, ray.direction, t_two);
                indicator = 1;
            } else if (t_one < t_two) {
                collision = SphereIntersectPoint(ray.origin, ray.direction, t_one);
                indicator = 1;
            }   
        } else if ((t_one > 0.0f) && (t_two < 0.0f)){ 
            collision = SphereIntersectPoint(ray.origin, ray.direction, t_one);
            indicator = 1;
        } else if ((t_one < 0.0f) && (t_two > 0.0f)){
            collision = SphereIntersectPoint(ray.origin, ray.direction, t_two);
            indicator = 1;
        } else if ((t_one < 0.0f) && (t_two < 0.0f)) {}
    } 
    else if (discriminant == 0.0f) {
        float t = (-1.0f * b) / (2.0f * a);
        collision = SphereIntersectPoint(ray.origin, ray.direction, t);
        indicator = 1;
    } else {}
    return vec4(collision.x, collision.y, collision.z, indicator);
}

int shadow(Scene scene, Ray ray) {
    for(int i = 0; i < scene.spheres.size(); i++)
    {
        vec4 result = Collision_Detect(ray, scene.spheres[i]);
        if(result.w == 1) 
        {
            return i;
        }
    }
    return -1;
}

// Uses the Phong Illumination Model to determine the color
Color Shade_Ray(Sphere sphere, Scene scene, vec3 intersection) { 
    Color od_color = sphere.materialcolor.diffusecolor;
    Color os_color = sphere.materialcolor.spechighcolor;
    vec3 sphere_center = vec3(sphere.x, sphere.y, sphere.z);
    float sum_r = 0.0f, sum_g = 0.0f, sum_b = 0.0f; 
    for (int i = 0; i < scene.lights.size(); i++) { 
        vec3 n_vec = (intersection - sphere_center) / sphere.r; // Surface norm direction
        vec3 l_vec = vec3(), collision = vec3();
        vec3 surface_pos = intersection;
        vec3 v_vec = scene.view_dir * -1.0f; // Direction to the viewer
        Light light = scene.lights[i];
        Ray shadow_ray = Ray();
        float offset = 0.0001f;
        vec3 light_pos = vec3(light.light_vec.x, light.light_vec.y, light.light_vec.z); 
        vec4 result = vec4();
        vec3 lpos_minus_spos = (light_pos - surface_pos);
        float shadow_flag = 1.0f; // Default not in shadow
        if (light.light_vec.w == 1.0f) { // Point Light
            l_vec = normalize(lpos_minus_spos);
            shadow_ray = Ray(surface_pos + (n_vec * offset), l_vec);
        } else if (light.light_vec.w == 0.0f) { // Directional light 
            vec3 neg_light_dir = vec3(-light_pos.x, -light_pos.y, -light_pos.z);
            l_vec = neg_light_dir / magnitude(light_pos);
            shadow_ray = Ray(surface_pos + (n_vec * offset), (l_vec * -1.0f));
        }
        // Now I test the shadow_ray against the rest of the spheres
        int test = shadow(scene, shadow_ray);
        Sphere hit = Sphere();
        if (test != -1) {
            for (int x = 0; x < scene.spheres.size(); x++) {
                if (test == x) { hit = scene.spheres[x]; }
            }
            result = Collision_Detect(shadow_ray, hit);
            collision = vec3(result.x, result.y, result.z);
            float collision_dist = magnitude(collision); 
            if (light.light_vec.w == 1.0f) { // Point light 
                float light_dist = magnitude(lpos_minus_spos);
                if (collision_dist < light_dist && collision_dist > 0.00001f) { shadow_flag = 0.0f; } 
            } else if (light.light_vec.w == 0.0f) { // Directional light 
                if (collision_dist > 0.00001f) { shadow_flag = 1.0f; } 
            }
        } else {}

        vec3 h_top = (l_vec + v_vec) / 2.0f; 
        vec3 h_vec = h_top / magnitude(h_top);
        float n_dot_l = dotProduct(n_vec, l_vec);
        float n_dot_h = dotProduct(n_vec, h_vec);
        float maxOne = max(0.0f, n_dot_l);
        float maxTwo = max(0.0f, n_dot_h);
        // When shadow_flag = 0.0f (shadow), the diffuse and spec of that light source are set to zero
        sum_r += shadow_flag * light.light_color.r * ((sphere.materialcolor.kd * od_color.r * maxOne) + (sphere.materialcolor.ks * os_color.r * pow(maxTwo, sphere.materialcolor.n)));
        sum_g += shadow_flag * light.light_color.g * ((sphere.materialcolor.kd * od_color.g * maxOne) + (sphere.materialcolor.ks * os_color.g * pow(maxTwo, sphere.materialcolor.n)));
        sum_b += shadow_flag * light.light_color.b * ((sphere.materialcolor.kd * od_color.b * maxOne) + (sphere.materialcolor.ks * os_color.b * pow(maxTwo, sphere.materialcolor.n)));
        // sum_r += shadow_flag * ((sphere.materialcolor.kd * od_color.r * maxOne) + (sphere.materialcolor.ks * os_color.r * pow(maxTwo, sphere.materialcolor.n)));
        // sum_g += shadow_flag * ((sphere.materialcolor.kd * od_color.g * maxOne) + (sphere.materialcolor.ks * os_color.g * pow(maxTwo, sphere.materialcolor.n)));
        // sum_b += shadow_flag * ((sphere.materialcolor.kd * od_color.b * maxOne) + (sphere.materialcolor.ks * os_color.b * pow(maxTwo, sphere.materialcolor.n)));
    }

    float I_r = (sphere.materialcolor.ka * od_color.r) + sum_r;
    float I_g = (sphere.materialcolor.ka * od_color.g) + sum_g;
    float I_b = (sphere.materialcolor.ka * od_color.b) + sum_b;
    Color I_lambda = Color(I_r, I_g, I_b);
    return I_lambda;
}

// Trace's the ray and returns the color of the frontmost sphere if there is an interestion, otherwise returns the background color
Color Trace_Ray(Scene scene, Ray ray, vector<Sphere> sphs) {
    Color temp;
    vector<Sphere> objects;
    vector<vec3> intersections;

    for (int m = 0; m < sphs.size(); m++) {
        vec4 collision = Collision_Detect(scene.viewing_ray, sphs[m]);
        if (collision.w == 1) {
            vec3 hit = vec3(collision.x, collision.y, collision.z);
            intersections.push_back(hit);
            objects.push_back(sphs[m]);
        }
    }

    vector<float> distances;
    vector<Sphere> s;

    if (intersections.size() < 1) { temp = scene.bkgcolor; } // No intersection, return background color
    else if (intersections.size() == 1) { temp = Shade_Ray(objects[0], scene, intersections[0]); } // One intersection, return the color of the object
    else { // Multiple intersections, find out which one is closest to eye
        for (int i = 0; i < intersections.size(); i++) { 
            vec3 theDistanceVec = intersections[i] - scene.view_origin;
            float theDistance = magnitude(theDistanceVec);
            distances.push_back(theDistance);
            s.push_back(objects[i]);
        }
        float min = *min_element(distances.begin(), distances.end());
        Sphere theOne;
        vec3 intersection;
        for (int i = 0; i < distances.size(); i++) { 
            if (min == distances[i]) { 
                theOne = s[i]; 
                intersection = intersections[i];
            } 
        }
        temp = Shade_Ray(theOne, scene, intersection); // Sending the sphere and intersection point we want to Shade_Ray
    }
    return temp;
}

int main(int argc, char* argv []) {
    std::string inputfile(argv[1]);
    std::string outputfile(argv[2]);
    std::ifstream file (inputfile);

    // Checks to make sure the input file is valid
    if (file.is_open() == false){
        printf("Error: incorrect file input.\n");
        return 1;
    } 

    // Creates a scene
    Scene thisScene;

    // Assigns all the input data to their variables in the scene struct
    string line;
    while (getline(file, line)) {
        if(line.size()-1 == 0) continue; // Skips empty lines
        std::string buffer;
        std::stringstream ss(line);
        std::vector<std::string> linetokens;
        while (ss >> buffer) {linetokens.push_back(buffer);}
        if (linetokens[0] == "eye") {
            float x_eye = stof(linetokens[1]);
            float y_eye = stof(linetokens[2]);
            float z_eye = stof(linetokens[3]);
            thisScene.view_origin = {x_eye, y_eye, z_eye};
        } else if (linetokens[0] == "viewdir") {
            float x_viewdir = stof(linetokens[1]);
            float y_viewdir = stof(linetokens[2]);
            float z_viewdir = stof(linetokens[3]);
            thisScene.view_dir = {x_viewdir, y_viewdir, z_viewdir};
        } else if (linetokens[0] == "updir") {
            float x_updir = stof(linetokens[1]);
            float y_updir = stof(linetokens[2]);
            float z_updir = stof(linetokens[3]);
            thisScene.up_dir = {x_updir, y_updir, z_updir};
        } else if (linetokens[0] == "vfov") {
            float vfov = stof(linetokens[1]);
            thisScene.vfov = vfov; 
        } else if (linetokens[0] == "imsize") {
            int w_imsize = stoi(linetokens[1]);
            int h_imsize = stoi(linetokens[2]);
            thisScene.w_imsize = w_imsize;
            thisScene.h_imsize = h_imsize;
        } else if (linetokens[0] == "bkgcolor") {
            float r_bkgcolor = stof(linetokens[1]); 
            float g_bkgcolor = stof(linetokens[2]); 
            float b_bkgcolor = stof(linetokens[3]); 
            Color bkgcolor = Color(r_bkgcolor, g_bkgcolor, b_bkgcolor);
            thisScene.bkgcolor = bkgcolor; 
        } else if (linetokens[0] == "mtlcolor") {
            float r_od = stof(linetokens[1]); 
            float g_od = stof(linetokens[2]);
            float b_od = stof(linetokens[3]);
            float r_os = stof(linetokens[4]);
            float g_os = stof(linetokens[5]);
            float b_os = stof(linetokens[6]);
            float ka = stof(linetokens[7]); // Surface ambient
            float kd = stof(linetokens[8]); // Surface diffuse
            float ks = stof(linetokens[9]); // Surface reflectivity
            float n = stof(linetokens[10]); // Falloff of the intensity of the spec high
            Color diffuse_color = Color(r_od, g_od, b_od); 
            Color spechigh_color = Color(r_os, g_os, b_os); 
            MaterialColor mtlcolor = MaterialColor(diffuse_color, spechigh_color, ka, kd, ks, n);
            thisScene.materialcolors.push_back(mtlcolor);
        } else if (linetokens[0] == "sphere") {
            float x_sphere = stof(linetokens[1]);
            float y_sphere = stof(linetokens[2]);
            float z_sphere = stof(linetokens[3]);
            float r_sphere = stof(linetokens[4]);
            Sphere sphere = Sphere(x_sphere, y_sphere, z_sphere, r_sphere);
            sphere.materialcolor = thisScene.materialcolors.back(); 
            thisScene.spheres.push_back(sphere);
        } else if (linetokens[0] == "light") {
            float x_light = stof(linetokens[1]);
            float y_light = stof(linetokens[2]);
            float z_light = stof(linetokens[3]);
            float w_light = stof(linetokens[4]);
            float r_light = stof(linetokens[5]);
            float g_light = stof(linetokens[6]);
            float b_light = stof(linetokens[7]);
            vec4 l_vec = vec4(x_light, y_light, z_light, w_light); 
            Color l_color = Color(r_light, g_light, b_light); 
            Light l = Light(l_vec, l_color);
            thisScene.lights.push_back(l);      
        } else {
            cout << "Error, input invalid." << endl;
            return 1;
        } 
    }

    //thisScene.to_string();

    // Initializing the image
    Pixel image[thisScene.h_imsize][thisScene.w_imsize];

    // All the math to find the viewing window
    thisScene.u_init = crossProduct(thisScene.view_dir, thisScene.up_dir);
    thisScene.u = normalize(thisScene.u_init); // horizontal direction in viewing plane

    thisScene.v_init = crossProduct(thisScene.u, thisScene.view_dir);
    thisScene.v = normalize(thisScene.v_init); // vertical direction in viewing plane

    thisScene.d = 5.0f; // Don't change for now
    thisScene.h_vw = 2.0f * thisScene.d * tan(((thisScene.vfov * PI)/180.0f)/2.0f);
    thisScene.aspect_ratio = thisScene.w_imsize / thisScene.h_imsize;
    thisScene.w_vw = thisScene.h_vw * thisScene.aspect_ratio;

    thisScene.ul = thisScene.view_origin + (thisScene.view_dir * thisScene.d) - (thisScene.u * (thisScene.w_vw/2)) + (thisScene.v * (thisScene.h_vw/2));
    thisScene.ur = thisScene.view_origin + (thisScene.view_dir * thisScene.d) + (thisScene.u * (thisScene.w_vw/2)) + (thisScene.v * (thisScene.h_vw/2));
    thisScene.ll = thisScene.view_origin + (thisScene.view_dir * thisScene.d) - (thisScene.u * (thisScene.w_vw/2)) - (thisScene.v * (thisScene.h_vw/2));
    thisScene.lr = thisScene.view_origin + (thisScene.view_dir * thisScene.d) + (thisScene.u * (thisScene.w_vw/2)) - (thisScene.v * (thisScene.h_vw/2));
    thisScene.delta_h = (thisScene.ur - thisScene.ul) / (thisScene.w_imsize);
    thisScene.delta_v = (thisScene.ll - thisScene.ul) / (thisScene.h_imsize);
    thisScene.delta_ch = (thisScene.delta_h) / 2;
    thisScene.delta_cv = (thisScene.delta_v) / 2;

    // For each pixel in the output image we call Trace_Ray
    for(uint32_t i = 0; i < thisScene.h_imsize; i++) { 
        for(uint32_t k = 0; k < thisScene.w_imsize; k++) {  
            thisScene.vw_location = thisScene.ul + (thisScene.delta_h * k) + (thisScene.delta_v * i) + thisScene.delta_ch + thisScene.delta_cv;
            thisScene.ray_dir = RayDir(thisScene.vw_location, thisScene.view_origin);
            thisScene.viewing_ray = Ray(thisScene.view_origin, thisScene.ray_dir);
            image[i][k].c  = Trace_Ray(thisScene, thisScene.viewing_ray, thisScene.spheres);
        }
    } 

    // Making sure the colors don't exceed 255
    for(uint32_t x = 0; x < thisScene.h_imsize; x++) { 
        for(uint32_t y = 0; y < thisScene.w_imsize; y++) { 
            if (image[x][y].c.r >= 1.0f) { image[x][y].c.r = 1.0f; }
            if (image[x][y].c.g >= 1.0f) { image[x][y].c.g = 1.0f; }
            if (image[x][y].c.b >= 1.0f) { image[x][y].c.b = 1.0f; }
        }
    }

    // Finally we create the ppm
    std::ofstream output_stream(outputfile, std::ios::out | std::ios::binary);
    output_stream << "P3\n" << thisScene.w_imsize << " " << thisScene.h_imsize << "\n255\n";
    for(uint32_t x = 0; x < thisScene.h_imsize; x++) { 
        for(uint32_t y = 0; y < thisScene.w_imsize; y++) { 
            output_stream << (int) (255 * image[x][y].c.r) 
            << " " << (int) (255 * image[x][y].c.g)
            << " " << (int) (255 * image[x][y].c.b)
            << "\n";
        }
    }

    output_stream.close();
   
    return 0;

}