from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str


class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"Message:", "Hello World!"}


@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@app.get("/transactions", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, limit: int = 100):
    transactions = db.query(models.Transaction).limit(limit).all()
    return transactions


@app.delete("/clear-db")
async def clear_db(db: db_dependency):
    try:
        models.Base.metadata.drop_all(bind=engine)
        models.Base.metadata.create_all(bind=engine)
        return {"message": "Database cleared and tables recreated successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to clear the database: {str(e)}"
        )


@app.delete("/delete-record/{id}")
async def clear_db(id: int, db: db_dependency):
    try:
        # Fetch the record by ID
        transaction = (
            db.query(models.Transaction).filter(models.Transaction.id == id).first()
        )

        if not transaction:
            raise HTTPException(status_code=404, detail="Record not found")

        # Delete the record
        db.delete(transaction)
        db.commit()

        return {"message": f"Transaction with ID {transaction} deleted successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete record: {str(e)}"
        )
