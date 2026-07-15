from ingest import conversational_rag
while True:
    user_input = input("You: ").strip()
    if user_input.lower() in ("exit", "quit", ""):
        print("Session ended.")
        break
    answer = conversational_rag(user_input)
    print(f"Bot: {answer}\n")