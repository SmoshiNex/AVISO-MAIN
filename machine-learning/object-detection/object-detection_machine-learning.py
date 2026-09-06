# The code below is a complete sample of how to train a YOLOv8 object detection model using a dataset from Roboflow for our AVISO capstone project. 
# It includes steps to verify GPU availability, install necessary dependencies, download the dataset, train the model,
# evaluate its performance, and export it for use in an Android application. 
# The code is structured into several cells, each performing a specific task in the workflow.


# ============================================================
# CELL 1: Verify GPU is active
# ============================================================
# nvidia-smi | Commented out since nag eerror kapag sa vscode

# ============================================================
# CELL 2: Install dependencies
# ============================================================
# pip install -q ultralytics roboflow | Commented out since nag eerror kapag sa vscode

# ============================================================
# CELL 3: Pull the finalized, pre-split dataset from Roboflow
# ============================================================
from roboflow import Roboflow

rf = Roboflow(api_key="YOUR_ROBOFLOW_API_KEY")  # replace with the actual Roboflow API key
project = rf.workspace("aldrians-workspace").project("v1-local-and-online-datasets-5-classess")
dataset = project.version(1).download("yolov8")

with open(f"{dataset.location}/data.yaml", "r") as f:
    print(f.read())

# ============================================================
# CELL 4: Load YOLOv8n, pretrained on COCO
# ============================================================
from ultralytics import YOLO

model = YOLO('yolov8n.pt')

# ============================================================
# CELL 5: Train the model on a dataset
# ============================================================
results = model.train(
    data=f"{dataset.location}/data.yaml",
    epochs=150,
    imgsz=640,
    batch=32,
    patience=25,
    device=[0, 1],
    cos_lr=True,
    project='/kaggle/working/AVISO_training',
    name='aviso_yolov8n_v1',
    exist_ok=True
)

# ============================================================
# CELL 6: Evaluate against our held-out TEST split
# ============================================================
metrics = model.val(
    data=f"{dataset.location}/data.yaml",
    split='test'
)

print("Overall mAP@0.5:", metrics.box.map50)
print("Overall mAP@0.5:0.95:", metrics.box.map)
print("Overall Precision:", metrics.box.mp)
print("Overall Recall:", metrics.box.mr)

print("\nPer-class mAP@0.5:")
for i, class_map in enumerate(metrics.box.maps):
    print(f"  Class {i}: {class_map:.3f}")

print("\nPer-class Precision and Recall:")
for i in range(len(metrics.box.p)):
    print(f"  Class {i}  Precision: {metrics.box.p[i]:.3f}  Recall: {metrics.box.r[i]:.3f}")

from IPython.display import Image, display
display(Image(filename=f"{metrics.save_dir}/confusion_matrix.png"))
display(Image(filename=f"{metrics.save_dir}/PR_curve.png"))

# ============================================================
# CELL 7: Export to TFLite for the Android app
# ============================================================
model.export(format='tflite')

# ============================================================
# CELL 8: Confirm the files are actually retrievable
# ============================================================
import os

for root, dirs, files in os.walk('/kaggle/working/AVISO_training'):
    for f in files:
        print(os.path.join(root, f))

print("\nGo to the Output panel on the right side of this notebook")
print("to download best.pt and the exported .tflite file, or")
print("click 'Save Version' to commit this run so it persists.")

# ============================================================
# CELL 9: Sanity check a class list against your app code
# ============================================================
import yaml

with open(f"{dataset.location}/data.yaml", "r") as f:
    data_config = yaml.safe_load(f)

print("Class order your model was trained on, index by index:")
for i, name in enumerate(data_config['names']):
    print(f"  {i}: {name}")
print("\nCopy this exact order into your app's class-name array.")