# import cv2 as cv
# import numpy as np
# from skimage import metrics
# from PIL import Image
# import sys
# from cap_from_youtube import cap_from_youtube
# import requests
# from bs4 import BeautifulSoup
# import io

# # Ensure there are enough command line arguments
# if len(sys.argv) < 6:
#     #print("Usage: script_youtube.py <youtube url> <X0_percent> <Y0_percent> <X1_percent> <Y1_percent>")
#     sys.exit(1)

# youtube_url = sys.argv[1]
# cap = cap_from_youtube(youtube_url)

# # Convert command line arguments to integers
# X0_percent = int(float(sys.argv[2]))
# Y0_percent = int(float(sys.argv[3]))
# X1_percent = int(float(sys.argv[4]))
# Y1_percent = int(float(sys.argv[5]))

# if not cap.isOpened():
#     #print("Error: Could not open video.")
#     sys.exit(1)

# prev_frame = None
# display_frame = None
# images = []

# FPS = cap.get(cv.CAP_PROP_FPS)
# SECONDS_PER_CAPTURE = 3
# FRAMES_PER_CAPTURE = int(FPS * SECONDS_PER_CAPTURE)

# frame_count = 0

# def np_to_PIL(img):
#     img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
#     return Image.fromarray(img)

# def is_similar(frame1, frame2):
#     ssim_score, _ = metrics.structural_similarity(frame1, frame2, full=True)
#     ssim_score = round(ssim_score, 2)
#     return ssim_score >= 0.95

# while cap.isOpened():
#     ret, frame = cap.read()
#     if not ret:
#         #print("Can't receive frame (stream end?). Exiting ...")
#         break
    
#     frame_count += 1

#     height, width, _ = frame.shape
#     X0 = int(X0_percent * width / 100)
#     X1 = int(X1_percent * width / 100)
#     Y0 = int(Y0_percent * height / 100)
#     Y1 = int(Y1_percent * height / 100)

#     if frame_count % FRAMES_PER_CAPTURE != 0:
#         continue

#     frame = frame[Y0:Y1, X0:X1]
#     gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

#     if display_frame is None:
#         display_frame = frame
#         images.append(np_to_PIL(display_frame))
#     else:
#         if prev_frame is not None:
#             prev_gray = cv.cvtColor(prev_frame, cv.COLOR_BGR2GRAY)
#             if not is_similar(gray, prev_gray):
#                 display_frame = frame
#                 images.append(np_to_PIL(display_frame))
#         prev_frame = frame

#     cv.imshow('frame', frame)
#     if cv.waitKey(1) == ord('q'):
#         break

# cap.release()
# cv.destroyAllWindows()


# if images:
#     output = io.BytesIO()
#     images[0].save(output, "PDF", resolution=100.0, save_all=True, append_images=images[1:])
#     output.seek(0)
#     sys.stdout.buffer.write(output.read())
# else:
#     sys.stdout.buffer.write(b"")
