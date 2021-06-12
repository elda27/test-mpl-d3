import matplotlib.pyplot as plt
from matplotlib import artist
from matplotlib.axes import Axes
from matplotlib.figure import Figure
from pathlib import Path
import fastapi
import pandas as pd
import pydantic
from typing import Optional, List, Dict
from sklearn.datasets import load_boston, make_regression
import mpld3
import seaborn as sns
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import numpy as np

app = fastapi.FastAPI()
app.mount(
    "/p",
    StaticFiles(directory=Path(__file__).parent / "bundle"),
    name="bundle"
)


def get_regression():
    X, y = make_regression(n_features=8, n_informative=2)
    if y.ndim == 1:
        y = y[:, np.newaxis]
    xs = np.concatenate([X, y], axis=1)
    return pd.DataFrame(
        xs,
        columns=[
            f'Feature{i}'for i in range(X.shape[1])
        ] + [
            f'Target{i}'for i in range(y.shape[1])
        ]
    )


def get_regression2():
    X, y = make_regression(n_samples=10000, n_features=4, n_informative=2)
    if y.ndim == 1:
        y = y[:, np.newaxis]
    xs = np.concatenate([X, y], axis=1)
    return pd.DataFrame(
        xs,
        columns=[
            f'Feature{i}'for i in range(X.shape[1])
        ] + [
            f'Target{i}'for i in range(y.shape[1])
        ]
    )


_data = {
    'DummyRegression': get_regression,
    'DummyRegression2': get_regression2,
}


class PlotResponse(pydantic.BaseModel):
    figure: str
    selectors: Optional[Dict[str, List[str]]]


def convert_d3_object(fig: Figure, artists=None):
    data = mpld3.fig_to_dict(fig)
    if artists is not None:
        mpld3.plugins.connect(fig, mpld3.plugins.LinkedBrush(artists))
    return data


async def get_data(dataType: Optional[str] = 'DummyRegression') -> pd.DataFrame:
    return _data[dataType]()


@ app.get('/')
async def read_items():
    return fastapi.responses.RedirectResponse('/p/index.html')


@ app.get('/list', response_model=List[str])
async def get_data_list():
    return list(_data.keys())


@ app.get('/list-plot', response_model=List[str])
async def get_plot_list():
    return ['histplot', 'histplot2d', 'kdeplot', 'kdeplot2d', 'pairplot']


@ app.get('/pairplot')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    grid = sns.pairplot(data=data)
    for ax in grid.axes.flat:
        ax.xaxis.set_ticks_position('bottom')
        ax.yaxis.set_ticks_position('left')
    return convert_d3_object(grid.fig)


@ app.get('/pairplot')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    grid = sns.pairplot(data=data)
    for ax in grid.axes.flat:
        ax.xaxis.set_ticks_position('bottom')
        ax.yaxis.set_ticks_position('left')
    return convert_d3_object(grid.fig)


@ app.get('/histplot')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    fig, ax = plt.subplots()
    sns.histplot(data=data, x=data.columns[0], ax=ax)
    return convert_d3_object(fig)


@ app.get('/histplot2d')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    fig, ax = plt.subplots()
    sns.histplot(data=data, x=data.columns[0], y=data.columns[1], ax=ax)
    return convert_d3_object(fig)


@ app.get('/kdeplot')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    fig, ax = plt.subplots()
    sns.kdeplot(data=data, x=data.columns[0], ax=ax)
    return convert_d3_object(fig)


@ app.get('/kdeplot2d')
async def pairplot(data: pd.DataFrame = fastapi.Depends(get_data)):
    fig, ax = plt.subplots()
    sns.kdeplot(data=data, x=data.columns[0],
                y=data.columns[1], shade=True, ax=ax)
    return convert_d3_object(fig)
