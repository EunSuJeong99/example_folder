from selenium import webdriver
import time


'''driver = webdriver.Chrome('./chromedriver')


youtube = 'https://www.youtube.com/'
driver.get(youtube)'''

time.sleep(2)

while True:
    keyword = input(' 레시피를 입력하시오.(0 입력시 종료) ')
    if keyword == '0':
        print('레시피 기능을 종료하겠습니다.')
        break
    driver = webdriver.Chrome('./chromedriver')

    youtube = 'https://www.youtube.com/results?search_query=' + keyword
    driver.get(youtube)
