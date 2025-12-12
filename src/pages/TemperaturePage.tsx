import React, { useState, useEffect } from "react";
import { LineChartData, LineChartProps } from "../dto/LineChartProps";
import { Chart, Colors, registerables } from 'chart.js';
import { ApiTemperatureObj } from "../apimodel/ApiModel";
import TemperatureGraph from "../components/TemperatureGraph";
import { ArtistTimelineDto } from "../dto/ListenTimelineDtos";
import DateTimePicker from 'react-datetime-picker'
import { TemperatureDto } from "../dto/TemperatureDto";

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function ListenTimelinePage() {

  const makeStartOfDay = (date: Date): Date => {
    date.setHours(0);
    date.setMilliseconds(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  };
  
  const makeEndOfDay = (date: Date): Date => {
    date.setHours(23);
    date.setMilliseconds(999);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
  };
  
  const [startDate, setStartDate] = useState(makeStartOfDay(new Date()));
  const [endDate, setEndDate] = useState(makeEndOfDay(new Date()));

  const [loading, setLoading] = useState(false);

  const url = 'https://z3h6bk2zdbissr7lsil7ewkepy0uhudg.lambda-url.eu-central-1.on.aws/';

  const [graphProps, setGraphProps] = useState<LineChartData>();

  function fetchGraph(): void {
    setLoading(true);
    var fullUrl = url + "?from=" + startDate.toISOString() + "&to=" + endDate.toISOString();
    fetch(fullUrl)
        .then((response) => response.json())
        .then((data: ApiTemperatureObj[]) => {
            var mappedData = data.map((tempDto) => { return {
                date_time: parseISOString(tempDto.date),
                temperature: tempDto.temperature
            }});

            setLoading(false);
            setGraphProps(mapGraph(mappedData));
        })
        .catch((err) => {
        console.log(err.message);
          setLoading(false);
        });
  }

  function parseISOString(s: string): Date {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(parseInt(b[0]), parseInt(b[1]) - 1, parseInt(b[2]), parseInt(b[3]), parseInt(b[4]), parseInt(b[5]), parseInt(b[6])));
  }

  // Auto-load graph on component mount
  useEffect(() => {
    fetchGraph();
  }, []);

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-3 menuPadding">
              <div className="form-group">
                <label className="form-label">Date from</label>
                <div>
                  <DateTimePicker className="form-control" onChange={(date) => date && setStartDate(date)} value={startDate} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date to</label>
                <div>
                  <DateTimePicker className="form-control" onChange={(date) => date && setEndDate(date)} value={endDate} />
                </div>
              </div>

              <button className="btn btn-primary mb-2 w-100" onClick={(e) => fetchGraph()}>Fetch graph!</button>

          </div>

          <div className="col-12 col-md-9">
            <TemperatureGraph data={graphProps} loading={loading} />
          </div>
        </div>
      </div>
    );
  
  function mapGraph(data: TemperatureDto[]): LineChartData {
    
    let color = "#3b82f6"; // Modern blue color

    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 500
              },
              color: '#374151',
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Temperature Over Time',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#1f2937',
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context: any) {
                return `Temperature: ${context.parsed.y.toFixed(1)}°C`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            min: 17,
            max: 27,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              callback: function(value: any) {
                return value + '°C';
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      },
      data: {
        labels: mapLabels(data),
        datasets: new Array({
          label: "Temperature",
          data: data.map(p => { return { x: p.date_time, y: p.temperature }} ),
          borderWidth: 3,
          tension: 0.4,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: color,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: color,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 3,
          })
      }
    }
  }

  function mapLabels(data: TemperatureDto[]): Date[] | undefined {
    return data.map(p => p.date_time);
  }

  // function mapDataset(data: TemperatureDto[]): import("chart.js").ChartDataset<"line", (number | import("chart.js").Point | null)[]>[] {
    
  //   return ;
    
  // }

  
}


export default ListenTimelinePage;