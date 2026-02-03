# 生成一个背单词的app

## 地址
当前目录下(word-bread-ai/)

## 技术栈
RN + EXPO + TypeScript + tailwindcss

## 客户端
web + app(ios + android)

## 功能
1. 拼写单词

## 页面
1. 文章列表页面
页面里面一个列表，列表里面展示所有的文章内容
点击具体的文章 调整到句子列表页面
2. 句子列表页面
列表页面展示 sentenceList
当前展示一个句子(句子内容如下: i hava a (pen-笔))，你在页面上展示 i have a _____(喇叭按钮，点击可以拼写单词).
用户可以在空白处 填写单词，点击提交按钮，如果填写正确，则显示绿色，如果填写错误，则显示红色，并且显示正确的单词。提交正确则进入下一个句子，错误则停留在当前页面。
页面里面有左右的方向按钮，点击可以去到上一个 下一个的句子。  

## UI
使用 web-design-guidelines  vercel-react-native-skills

