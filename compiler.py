archive_list = {
    1: "includes/back.js",
    2: "includes/front.js",
    3: "includes/sFetch.js",

    4: "starters/start_watch_mouse.js",
    5: "starters/start_watch_XMLHttpRequest.js",
    6: "starters/start_style_and_interface.js"
}

compiled = open("compiled.js","w")

compiled.write("document.compiled = true;")

for number in archive_list:
    print(archive_list[number])
    archive_opened = open( archive_list[number] , "r")
    compiled.write( archive_opened.read() + "\n\n")

compiled.close()