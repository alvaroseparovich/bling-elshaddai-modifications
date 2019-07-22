import json

arch = open("original.js","r")
arch = arch.read()
arch = arch[arch.find("{")+1:-1].replace("\t","").replace("\n","")

arc_list = arch[ arch.find("{") : arch.find("}")+1 ]
print(arc_list)
archive_list = json.loads(arc_list)

compiled = open("compiled.js","w")

compiled.write("document.compiled = true;")

for number in archive_list:
    print(archive_list[number])
    archive_opened = open( archive_list[number] , "r")
    compiled.write( archive_opened.read() + "\n\n")

compiled.close()