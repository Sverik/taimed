# http://www.gameart2d.com/cat-and-dog-free-sprites.html
for t in $(ls -1 *png | sed -e 's/\(\w\+\).*/\1/g' | sort -u); do echo \#$t; echo -n convert +append " "; find . -name $t\ \* | sort -t \( -k 2 -g | perl -0777 -pe 's/([^\n]+)\n/"\1" /igs'; echo ../Cat_$t.png; done > tostrip.sh
