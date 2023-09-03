import { Component, OnInit } from '@angular/core';
import { TimeTableService } from '../../services/time-table.service';
import { TimeTableEntry } from '../../model/time-table';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  dataSource: any[] = [];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  displayedColumns: string[] = ['timePeriod', ...this.days];
  isEditing = false;
  editedData: any = {};

  constructor(private timeTableService: TimeTableService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.timeTableService.fetchTimeTable().subscribe(data => {
      this.dataSource = this.prepareData(data);
    });
  }

  prepareData(data: TimeTableEntry[]): any[] {
    return Array.from({ length: 24 }, (_, hour) => this.createRowForHour(hour, data));
  }

  createRowForHour(hour: number, data: TimeTableEntry[]): { [key: string]: string | number } {
    const nextHour = (hour + 1) % 24;
    const timePeriod = `${this.formatHour(hour)} - ${this.formatHour(nextHour)}`;
    const row: { [key: string]: string | number } = { timePeriod };

    this.days.forEach(day => {
      const entry = data.find(e =>
        new Date(e.date_time).getUTCDay() === this.days.indexOf(day) && 
        new Date(e.date_time).getUTCHours() === hour
      );
      row[day] = entry ? entry.display_value : '-';
    });

    return row;
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12:00am';
    if (hour < 12) return `${hour}:00am`;
    if (hour === 12) return '12:00pm';
    return `${hour - 12}:00pm`;
  }

  onEdit(): void {
    this.isEditing = true;
    this.editedData = JSON.parse(JSON.stringify(this.dataSource));
  }

  onSubmit(): void {
    this.dataSource.forEach((row, rowIndex) => {
      this.days.forEach(day => {
        if (this.editedData[rowIndex][day] !== row[day]) {
          console.log(`Edited Data for ${day} ${row.timePeriod}: ${row[day]}`);
        }
      });
    });
    this.isEditing = false;
  }
}
