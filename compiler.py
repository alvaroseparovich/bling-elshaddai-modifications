archive_list = {
    1:"includes/back.js",
    2:"includes/front.js",
    3:"includes/sFetch.js",
    4:"original.js"
}

compiled = open("compiled.js","w")

for number in archive_list:
    print(archive_list[number])
    archive_opened = open( archive_list[number] , "r")
    compiled.write( archive_opened.read() + "\n\n")

compiled.close()
