import glob, os, io
root=os.path.dirname(os.path.abspath(__file__))
rd=lambda p: io.open(os.path.join(root,p),encoding='utf-8').read()
css=rd('src/styles.css')
js='\n'.join(io.open(f,encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(root,'src','js','*.js'))))
html=rd('src/template.html').replace('/*CSS*/',css).replace('/*JS*/',js.replace('</script>','<'+'\/script>'))
io.open(os.path.join(root,'index.html'),'w',encoding='utf-8',newline='\n').write(html)
print('built index.html', len(html)//1024, 'KB')
