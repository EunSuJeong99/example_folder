from django.shortcuts import render

def index(request):
    return render(request,'index.html')

def article(request):
    return render(request,'article.html')

def map(request):
    return render(request,'map.html')

def blog(request):
    return render(request,'blog.html')

def media(request):
    return render(request,'media.html')

def house(request):
    return render(request,'house.html')

def door(request):
    return render(request,'door.html')
