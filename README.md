Platonic Solids
-------------------------
An experiment created with [three.js](http://mrdoob.github.io/three.js/).
Thank you to [Dr. Andy Long](http://www.nku.edu/~longa/) for helping me so much with the mathematics!

Concept
-------------------------
As we know, opposites attract.  However, electrons emit the same charge, causing one another to be
repelled from each other, and therefore try to distance themselves from other electrons.  This project
was an experiment that attempted to simulate electrons, represented as glowing orange balls, that are
bound to a sphere and forced to interact with other electrons.  

By "bound to a sphere", I mean that at no point can any electron be further than 1 unit away from the center
of the sphere (which is point (0,0,0).) You can imagine that each orange ball has an invisible string attached
to it that extends from the center of the sphere, so that orange ball can't leave. If they were not bound to
that sphere, then the electrons would scatter off far into space to never return.  

The electrons are then forced to interact with one another. The electrons will push, and be pushed upon by, other
electrons. It's bound to the sphere, so it cannot escape, but can only try to distance itself away from all
other electrons as far away as possible. Since all electrons will be thinking the same thing (i.e. "I hate
other electrons; I want to get as far away from there as possible" ), all of the electrons will then be the
same distance away from each other. If they are not, then one electron will be too close to it, so it'll adjust,
and possibly keep adjusting until it settles that if it moves in any direction, it'll be too close to some other
electron, so it has to stay put - Electrons dislike all other electrons equally. Once the electrons have evenly
spaced out, an interesting shape may form, such as a [platonic solid](http://en.wikipedia.org/wiki/Platonic_solid)
if there are a certain amount of electrons (4, 6, 8, 12, or 20.) Click the connect button to see what shape is formed.

There are between 0 and 20 electrons at any time, which the user can adjust. Users can also adjust a magical
factor called "Intensity." Both the force that each electron feels from other electrons as well
as each electron's velocity are multiplied by it, so that increasing it to 200% effectively speeds up the
process.  

Very Basic Pseudocode
-------------------------
Feel free to download the source code and browse around, but here's a very very very broad outline
of how they interact:

    every frame of animation:
    
        foreach active electron:
            
            calculate force vector by adding up all of the other electron's vectors,
            with further distance having less of a push than a close electron
            
            apply intensity to the force vector
            
            add the force vector to the active electron's velocity
            
            apply intensity to the active electron's velocity
            
            apply friction to the active electron's velocity
            
            pull the electron back onto the sphere
            















