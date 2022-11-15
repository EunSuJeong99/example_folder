from django.shortcuts import render
from selenium import webdriver
import time
from django.http import HttpRequest

def index(request:HttpRequest):
    # keyword=request.GET.get('chattext')
    # if keyword != None:
    #     '''driver = webdriver.Chrome('./chromedriver')
    #         youtube = 'https://www.youtube.com/'
    #         driver.get(youtube)'''
    # time.sleep(2)
    
    # # if keyword == '0':
    # #     print('레시피 기능을 종료하겠습니다.')
    
    # driver = webdriver.Chrome('./chromedriver')
    # youtube = 'https://www.youtube.com/results?search_query=' + str(keyword)
    # driver.get(youtube)

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
