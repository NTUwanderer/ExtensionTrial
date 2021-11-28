import sys

count = 0
with open(sys.argv[1]) as inF:
    for line in inF:
        if line[0] == '*' and line[1] == '*' and line[2] == '*':
            count += 1

print('count: ', count)
