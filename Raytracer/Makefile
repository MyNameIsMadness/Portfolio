XX=g++
CXXFLAGS= -std=c++11 -g

all: raytracer
clean:
	rm -f *.o *.h.gch raytracer
test: raytracer
	./raytracer
.PHONY: all clean test

raytracer: main.o
	$(CXX) $(LDFLAGS) -o $(@) $(^)

%.o: %.cpp 
	$(CXX) $(CXXFLAGS) -c -o $(@) $(<)