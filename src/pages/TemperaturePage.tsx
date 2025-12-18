import React, { useState, useEffect } from "react";
import { LineChartData, LineChartProps } from "../dto/LineChartProps";
import { ApiTemperatureObj } from "../apimodel/ApiModel";
import TemperatureGraph from "../components/TemperatureGraph";
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDetected, setMobileDetected] = useState(false);

  const url = 'https://z3h6bk2zdbissr7lsil7ewkepy0uhudg.lambda-url.eu-central-1.on.aws/';

  const [graphProps, setGraphProps] = useState<LineChartData>();
  const [temperatureData, setTemperatureData] = useState<TemperatureDto[]>([]);
  const [chartSeries, setChartSeries] = useState<any[]>([]);

  // Detect if device is mobile/touch-enabled
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setMobileDetected(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle orientation changes - re-compute options only
  useEffect(() => {
    const handleOrientationChange = () => {
      if (chartSeries.length > 0) {
        // Re-compute options only, use existing series data
        refreshGraphOptions();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [chartSeries, isMobile]);

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
            setTemperatureData(mappedData);
            refreshGraph(mappedData);
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

  // Auto-load graph after mobile detection is complete
  useEffect(() => {
    if (mobileDetected) {
      fetchGraph();
    }
  }, [mobileDetected]);

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 menuPadding">
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

          <div className="col-12 col-sm-8 col-md-9">
            <TemperatureGraph data={graphProps} loading={loading} />
          </div>
        </div>
      </div>
    );
  
  function computeChartOptions(): any {
    let color = "#cc2828ff";
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobileLandscape = isMobile && isLandscape;
    
    return {
      chart: {
        toolbar: {
          show: !isMobileLandscape
        },
        zoom: {
          type: 'x',
          enabled: !isMobile,
          autoScaleYaxis: true
        },
        animations: {
          enabled: false
        },
        offsetY: isMobileLandscape ? -10 : 0,
        sparkline: {
          enabled: false
        }
      },
      colors: [color],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: isMobileLandscape ? '' : 'Temperature Over Time',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1f2937'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          },
          formatter: function(value: number) {
            return value.toFixed(1) + '°C';
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy HH:mm'
        },
        y: {
          formatter: function(value: number) {
            return value.toFixed(1) + '°C';
          }
        }
      },
      markers: {
        size: 0,
      },
      legend: {
        show: true,
        position: 'top',
        fontSize: isMobileLandscape ? '12px' : '14px',
        fontWeight: 500,
        labels: {
          colors: '#374151'
        },
        offsetY: isMobileLandscape ? -5 : 0,
        height: isMobileLandscape ? 20 : undefined
      },
      grid: {
        borderColor: 'rgba(0, 0, 0, 0.05)',
        xaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: isMobileLandscape ? -10 : 0,
          bottom: isMobileLandscape ? 0 : 10
        }
      },
    }
  }

  function computeChartData(data: TemperatureDto[]): any[] {
    return [{
      name: 'Temperature',
      data: data.map(p => ({ 
        x: p.date_time.getTime(), 
        y: p.temperature 
      }))
    }];
  }

  function refreshGraph(data: TemperatureDto[]): void {
    const series = computeChartData(data);
    setChartSeries(series);
    const chartData: LineChartData = {
      options: computeChartOptions(),
      series: series
    };
    setGraphProps(chartData);
  }

  function refreshGraphOptions(): void {
    const chartData: LineChartData = {
      options: computeChartOptions(),
      series: chartSeries
    };
    setGraphProps(chartData);
  }
  }




export default ListenTimelinePage;