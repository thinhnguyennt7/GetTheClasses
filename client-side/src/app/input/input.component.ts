import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { Criteria } from '../models/criteria';
import { HttpMethodService } from '../http-method.service';
import { CourseCriteria } from '../models/courseCriteria';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TransferDataService } from '../services/transfer-data.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: [
          './input.component.css',
          "../../../node_modules/primeng/resources/themes/bootstrap/theme.css"
  ]
})
export class InputComponent {
  @Output() courseClicked: EventEmitter<any> = new EventEmitter();

    subject: string[] = ['--', 'ACCT', 'AE', 'APPH', 'ARBC', 'ARCH', 'AS', 'ASE', 'BCP', 'BMED'];
    filteredsubject: any[];
    eventClicked: boolean = false;
    subjectChoose: string;
    subjectSelected: string = '';
    constructor(private methodHelper: HttpMethodService,
      private transferDataService: TransferDataService) { }

    private result: any[] = [];
    private criteria: Criteria[] = [];
    private major: string;
    private courseNumber: string;
    private timeSchedule;

    classDetails: string[] = ['ACCT 2101', 'ACCT 2102'];
    filteredClassDetails: any[];
    classChoose: string;
    classSelected: string = '';
    classClicked: boolean = false;

    sectionDetails: string[] = ['ACCT 2101 - A'];

  // Filter function for autocomplete search
  filterSearch(event) {
    this.filteredsubject = [];
    for (let i = 0; i < this.subject.length; i++) {
      let subjectChoose = this.subject[i];
      if (subjectChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredsubject.push(subjectChoose);
      }
    }
  }

  // Capture the selected subject
  captureId($event) {
    this.subjectSelected = $event;
    if ($event != '' && $event != '--') {
      this.eventClicked = true;
    } else if ($event == '--') {
      this.eventClicked = false;
    }
  }

  filterClassSearch(event) {
    this.filteredClassDetails = [];
    for (let i = 0; i < this.classDetails.length; i++) {
      let classChoose = this.classDetails[i];
      if (classChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredClassDetails.push(classChoose);
      }
    }
  }

  captureClass($event) {
    this.classSelected = $event;
    this.classClicked = true;
  }

  // onCourseClicked() {

  // }

// Test

  cities = [
    {id: 1, name: ' CS 1331 - A01', professor: 'P. Christopher L Simpkins', time: 'MWF - 10:10 - 11:00 | T - 16:30 - 17:45', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
    {id: 2, name: ' CS 1331 - A02', professor: 'P. Christopher L Simpkins', time: 'MWF - 10:10 - 11:00 | T - 16:30 - 17:45', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
    {id: 3, name: ' CS 1331 - A04', professor: 'P. Christopher L Simpkins', time: 'MWF - 10:10 - 11:00 | T - 18:00 - 19:15', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'},
    {id: 4, name: ' CS 1331 - B02', professor: 'P. Christopher L Simpkins', time: 'MWF - 09:05 - 09:55 | T - 16:30 - 17:45', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
    {id: 5, name: ' CS 1331 - B03', professor: 'P. Christopher L Simpkins', time: 'MWF - 09:05 - 09:55 | T - 16:30 - 17:45', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
    {id: 6, name: ' CS 1331 - B04', professor: 'P. Christopher L Simpkins', time: 'MWF - 09:-5 - 09:55 | T - 18:00 - 19:15', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
];

courseList = this.cities.slice();
cities3 = this.cities.slice();
// cities4 = this.cities.slice();

selectedCity = this.cities[0].name;
// selectedCity2 = this.cities2[1].name;
selectedCourse = 'Quick Add';
// selectedCity3 = "Select Section";

people = [];
selectedPeople = [];
serverSideFilterItems = [];

peopleTypeahead = new EventEmitter<string>();

selectAll() {
    this.selectedPeople = this.people.map(x => x.name);
}

unselectAll() {
    this.selectedPeople = [];
}

onCourseSelect($event) {
  this.courseClicked.emit($event);
}

  getMajor(event: any): void {
    this.major = event.target.value;
  }

  getCourseNumber(event: any): void {
    this.courseNumber = event.target.value;
  }

  clear(): void {
    this.criteria = [];
    console.log(this.criteria);
  }

  save(): void {
    this.criteria.push({
      major: this.major,
      courseNumber: this.courseNumber
    });
    console.log(this.criteria);
  }

  getClasses() {
    this.timeSchedule = this.transferDataService.getFreeTime();
    this.methodHelper.post(environment.HOST + '/api/course', {
      criteria: this.criteria,
      freeTime: this.timeSchedule
    })
      .subscribe((data) => {
        console.log(data);
      });
  }

  sample() {
    this.methodHelper.get(environment.HOST + '/api/classDetailInfo/?crn=82849')
    .subscribe((data) => {
      console.log("Class Detail: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/classGeneralInfo/?major=CS&courseNumber=1331&crn=82849')
    .subscribe((data) => {
      console.log("Class General: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/courseDetailInfo/?major=CS&courseNumber=1331')
    .subscribe((data) => {
      console.log("Course Detail: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/courseGeneralInfo/?major=CS&courseNumber=1331')
    .subscribe((data) => {
      console.log("Course General: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getAllMajorsName')
    .subscribe((data) => {
      console.log("getAllMajorsName: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getAllMajorsAndCourseNumbers')
    .subscribe((data) => {
      console.log("getAllMajorsAndCourseNumbers: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getSpecificMajorCourseNumbers/?major=CS')
    .subscribe((data) => {
      console.log("getSpecificMajorCourseNumbers: ");
      console.log(data);
    });
  }
}
