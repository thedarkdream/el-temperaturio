import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { LineChartProps } from "../dto/LineChartProps";
import Spinner from '../puff.svg';

import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function TemperatureGraph( props: LineChartProps ) {

    return <div className="temperatureGraph">
        {props.loading && <img src={Spinner} alt="Loading..." width="100px"/>}
        {props.data && (
            <div className="chartContainer">
                <div className="chartWrapper">
                    <Line data={props.data.data} options={props.data.options} />
                </div>
            </div>
        )}
    </div>
}

export default TemperatureGraph;