import os

novel = '長夜餘火2'
output = '長夜餘火_470_to_669.txt'

def getIndex(file):
    spt = file.split('_')
    return int(spt[0])


files = os.listdir(novel)

print("size: ", len(files))
files.sort(key=getIndex)

with open(output, 'a') as outF:
    for file in files:
        with open(novel + "/" + file) as inF:
            for line in inF:
                outF.write(line)
            

