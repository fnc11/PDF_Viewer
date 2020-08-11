# Introduction
Welcome to our recruitment challenge. Solving the task provided below will qualify you to a job interview with us.
We provide in this folder a basic skeleton of a [Flask](https://flask.palletsprojects.com/en/1.1.x/)
 project that should be extended to serve the web app you will write.

# Main Task: PDF Visualization
In this task, you need to extend the basic Flask web server provided to dynamically load and display a pdf embedded into the web page using [PDF.JS](https://mozilla.github.io/pdf.js/). You are free to layout the webpage according to your best judgment. However, you need to embed the viewer into a page and not simply call PDF.JS and use it to render an entire webpage containing only the viewer.
You are free to use javascript frameworks, however, light, simple and functional pages are preferred. Complex animations or design are not priorities. Keep in mind that **usability**, **efficiency** and the **code quality** are what we care about the most.

# Bonus Tasks
After completing the previous task, if you would like an additional challenge and better highlight your skills, you can work on any of these Bonus tasks. Bonus Task 2 depends partially on Bonus 1, however. Even if you cannot complete these tasks, submit your work for them since they could help us have a better understanding of your abilities. Submitting a partial task for these bonus tasks **will** be regarded as better than not submitting at all. 

## \[Bonus 1\] Making and Visualizing Annotations
Good quality data is very important for machine learning applications.
In natural language processing, data may exist in the form of annotations in text.
These annotations may have different types that are used to label different attributes
of the text. 

Imagine that we have tweets referring to the traffic on a given city and each one of them refers to a location and 
describes what is going on there:
```
This morning we have 10 km of congestion overall in the city.
```
Different words in this sentence represent different pieces of information like what happened and where.
A possible annotation of this Tweet is:
```
(This morning)<time of day> we have (10 km)<affected length> of (congestion)<congestion status>
 (overall in the city)<location>.
```

Notice that different pieces of information are annotated with different **annotation types**
With many tweets like this, a system could be built to read all this information from the internet and display
in a map the status of the road network in real-time. 

In this challenge, we aim to build a simple annotation tool that is vital for the data gathering process. You should
extend the pdf viewer to work as an annotator. The requirements are:

* the system should support arbitrarily many annotation types that should be configurable. Each type has its unique name
* an annotation should be added by choosing an annotation type from the interface (e.g. a   dropdown list) and selecting the text in the pdf viewer
* The user must be able to annotate any page in the document
* the annotations should be saved somewhere in the backend
* upon loading the page, previous annotations should be displayed. 
* the interface should take efficiency and usability into account. The target audience of this tool would be
domain experts and not computer scientists.

## \[Bonus 2\] Databases
Store the annotations onto a no-SQL database

## \[Bonus 3\] 
Create a docker deployment of your application using a Dockerfile (and, for extra points, docker-compose). You should 
provide build and starts scripts for your docker deployment  

# Submission
Please submit your your zipped solution with your resume via email to mmdlecture@gmail.com

# Notes
sample pdf was obtained from https://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=eng
