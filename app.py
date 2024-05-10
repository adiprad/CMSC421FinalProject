if __name__ == '__main__':
  import os
  from simpletransformers.classification import ClassificationModel, ClassificationArgs
  import asyncio
  import websockets

  models = [
    {"type": "bert", "name": "content/model_checkpoints/BERT-Tiny_Spam_Assasin/checkpoint_3048_epoch_6"},
    {"type": "bert", "name": "content/model_checkpoints/BERT-Tiny_spam2_ds/checkpoint_2718_epoch_6"},
    {"type": "distilbert", "name": "content/model_checkpoints/Distilbert_Spam_Assasin/checkpoint_3048_epoch_6"},
    {"type": "distilbert", "name": "content/model_checkpoints/Distilbert_spam2_ds/checkpoint_2718_epoch_6"},
    {"type": "roberta", "name": "content/model_checkpoints/Roberta_Spam_Assasin/checkpoint_3048_epoch_6"},
    {"type": "roberta", "name": "content/model_checkpoints/Roberta_spam2_ds/checkpoint_2718_epoch_6"}
  ]

  async def handler(websocket):
    while True:
      email = await websocket.recv()

      for model in models:
        args = ClassificationArgs()
        args.load(os.path.dirname(f'{model["name"]}/training_args.bin'))
        m = ClassificationModel(
            model_type=model["type"],
            model_name=model["name"],
            args=args,
            use_cuda=False
        )
        p, _ = m.predict([email])
        await websocket.send(str(p))
    
  start_server = websockets.serve(handler, "localhost", 8000)

  asyncio.get_event_loop().run_until_complete(start_server)
  asyncio.get_event_loop().run_forever()
    
