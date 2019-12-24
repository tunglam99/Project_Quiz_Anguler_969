import {Component, OnInit} from '@angular/core';
import {Question} from '../../model/question';
import {QuizService} from '../../service/quiz.service';
import {QuestionService} from '../../service/question.service';
import {Quiz} from '../../model/quiz';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-add-question-to-quiz',
  templateUrl: './add-question-to-quiz.component.html',
  styleUrls: ['./add-question-to-quiz.component.css']
})
export class AddQuestionToQuizComponent implements OnInit {
  questionList: Question[] = [];
  quiz: Quiz;
  sub: Subscription;
  currentQuestion: Question;

  constructor(private quizService: QuizService,
              private questionService: QuestionService,
              private activatedRoute: ActivatedRoute) {
    this.getQuestionList();
  }

  ngOnInit() {
    this.sub = this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const id = +paramMap.get('id');
      this.quizService.getQuiz(id).subscribe(result => {
        this.quiz = result;
      }, error => {
        console.log(error);
      });
    });
  }

  getQuestionList() {
    this.questionService.findAllQuestionByQuiz().subscribe(result => {
      this.questionList = result;
    }, error => {
      console.log(error);
    });
  }

  getQuestionDetail(id: number) {
    this.questionService.getQuestion(id).subscribe(result => {
      this.currentQuestion = result;
    }, error => {
      console.log(error);
    });
  }

  addQuestionToQuiz(questionId: number) {
    this.getQuestionDetail(questionId);
    if (this.currentQuestion.id != null) {
      const question: Question = {
        id: this.currentQuestion.id,
        content: this.currentQuestion.content,
        typeOfQuestion: this.currentQuestion.typeOfQuestion,
        category: this.currentQuestion.category,
        correctAnswer: this.currentQuestion.correctAnswer,
        status: this.currentQuestion.status,
        quiz: {
          id: this.quiz.id,
        }
      };
      this.questionService.updateQuestion(questionId, question).subscribe(() => {
        this.getQuestionList();
      }, error => {
        console.log(error);
      });
    }
  }
}
