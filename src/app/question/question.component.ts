import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../service/question.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Question} from '../model/question';
import {TypeOfQuestionService} from '../service/type-of-question.service';
import {TypeOfQuestion} from '../model/type-of-question';
import {CategoryService} from '../service/category.service';
import {Category} from '../model/category';
import {AnswerService} from '../service/answer.service';
import {Answer} from '../model/answer';

const BEST_ANSWER = 'Chọn 1 đáp án đúng';
const MULTI_ANSWER = 'Chọn nhiều đáp án';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questionStatusIsTrueList: Question[] = [];
  questionList: Question[] = [];
  typeOfQuestionList: TypeOfQuestion[] = [];
  categoryList: Category[] = [];
  answerList: Answer[] = [];
  questionForm: FormGroup = new FormGroup({
    content: new FormControl('', Validators.required),
    correctAnswer: new FormControl('', Validators.required),
    typeOfQuestion: new FormControl(''),
    category: new FormControl('')
  });
  answerForm: FormGroup = new FormGroup({
    content: new FormControl('', Validators.required),
    question: new FormControl('')
  });
  failMessage: string;
  formCreateStatus: boolean;
  showCreateAnswerForm: boolean;
  questionCurrentId: number;
  questionStatus: boolean;
  createFlag: boolean;
  currentQuestion: Question;
  currentTypeOfQuestion: TypeOfQuestion;
  typeOfQuestionFlag: number;

  constructor(private questionService: QuestionService,
              private typeOfQuestionService: TypeOfQuestionService,
              private categoryService: CategoryService,
              private answerService: AnswerService) {
    this.formCreateStatus = false;
    this.showCreateAnswerForm = false;
    this.getQuestionList();
    this.getTypeOfQuestionList();
    this.getCategoryList();
    this.getQuestionStatusIsTrue();
  }

  ngOnInit() {
    this.createFlag = false;
  }

  onClickCreate() {
    this.questionCurrentId = this.questionList.length + 1;
    this.formCreateStatus = !this.formCreateStatus;
  }

  addQuestion() {
    const question: Question = {
      id: this.questionCurrentId,
      content: this.questionForm.value.quiz,
      status: this.questionStatus,
      correctAnswer: this.questionForm.value.correctAnswer,
      typeOfQuestion: {
        id: this.questionForm.value.typeOfQuestion
      },
      category: {
        id: this.questionForm.value.category
      }
    };
    this.questionService.createQuestion(question).subscribe(() => {
      this.createFlag = true;
      this.questionStatusIsTrueList.push(question);
      this.getQuestionList();
    }, () => {
      this.failMessage = 'Tạo mới thất bại';
    });
    this.getAnswerList(this.questionCurrentId);
  }

  saveQuestionForm() {
    this.questionStatus = true;
  }

  closeQuestionForm() {
    this.questionStatus = false;
  }

  submitQuestion() {
    this.addQuestion();
    this.questionForm.reset();
    this.formCreateStatus = false;
  }

  updateQuestion(id: number) {
    const question: Question = {
      status: true,
      id: this.currentQuestion.id,
      content: this.questionForm.value.content,
      correctAnswer: this.questionForm.value.correctAnswer
    };
    this.questionService.updateQuestion(id, question).subscribe(() => {
      this.questionForm.reset();
      this.getCategoryList();
    }, () => {
      this.failMessage = 'Lỗi trong quá trình cập nhật';
    });
  }

  getQuestionDetail(id: number) {
    this.questionService.getQuestion(id).subscribe(result => {
      this.currentQuestion = result;
    }, () => {
      this.failMessage = 'Lỗi không tìm thấy câu hỏi có id = ' + id;
    });
  }

  getQuestionList() {
    this.questionService.listQuestion().subscribe(result => {
      this.questionList = result;
    });
  }

  getQuestionStatusIsTrue() {
    this.questionService.listQuestionStatusIsTrue().subscribe(result => {
      this.questionStatusIsTrueList = result;
    });
  }

  getTypeOfQuestionList() {
    this.typeOfQuestionService.listTypeOfQuestion().subscribe(result => {
      this.typeOfQuestionList = result;
    });
  }

  getCategoryList() {
    this.categoryService.listCategory().subscribe(result => {
      this.categoryList = result;
    });
  }

  getAnswerList(id: number) {
    this.answerService.listAnswerByQuestion(id).subscribe(result => {
      this.answerList = result;
    });
  }

  addAnswer() {
    this.addQuestion();
    if (this.createFlag) {
      const answer: Answer = {
        id: this.answerForm.value.id,
        content: this.answerForm.value.content,
        question: {
          id: this.questionCurrentId
        }
      };
      this.answerService.createAnswer(answer).subscribe(() => {
        this.answerList.push(answer);
        this.getAnswerList(this.questionCurrentId);
        this.answerForm.reset();
        this.showCreateAnswerForm = false;
      }, () => {
        this.failMessage = 'Tạo câu trả lời thất bại';
      });
    }

  }

  deleteAnswer(id: number) {
    this.answerService.deleteAnswer(id).subscribe(() => {
      this.getAnswerList(this.questionCurrentId);
    }, () => {
      this.failMessage = 'Lỗi khi xóa câu trả lời có id = ' + id;
    });
  }

  getTypeOfQuestion(id: number) {
    this.typeOfQuestionService.getTypeOfQuestion(id).subscribe(result => {
      this.currentTypeOfQuestion = result;
    }, error => {
      console.log(error);
    });
  }

  typeOfQuestionForm(id: number) {
    console.log(id);
    if (id == 1) {
      this.typeOfQuestionFlag = 1;
    } else {
      this.typeOfQuestionFlag = 2;
    }
  }
}
