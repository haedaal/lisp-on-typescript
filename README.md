## Lisp-like interpreter on typescript

racket 수업 듣고 만들어보는 연습용

### TODO

1.  make rpl - read-print-loop
2.  make parser
3.  read value & print value
4.  read basic expression & eval
5.  func & closure & local variable
6.  module
7.  gc

### Issues

* def 와 if 의 ast 를 일반 함수와 동일하게 했더니 여러 문제 생긴다
* if e1, e2, e3 를 모두 바로 eval 하게 되어있어서 재귀함수는 무한루프 돔 - 결국 두개 구별해내거나 전부다 lazy eval 하도록?
* builtIn 함수들을 매번 closure 로 만들게 되는것은 좀 이상함
