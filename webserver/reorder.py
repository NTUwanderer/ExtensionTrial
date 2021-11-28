import os

novel = '長夜餘火'

files = os.listdir(novel)
for file in files:
    spt = file.split('_')
    index = int(spt[0])
    if index >= 522:
        orig_name = novel + '/' + file
        new_name = novel + '/' + str(index - 2) + '_' + spt[1]
        os.rename(orig_name, new_name)
