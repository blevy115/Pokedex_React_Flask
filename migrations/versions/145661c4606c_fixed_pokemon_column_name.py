"""Fixed Pokemon COlumn Name

Revision ID: 145661c4606c
Revises: 954feddd63c5
Create Date: 2023-04-01 11:54:12.432807

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '145661c4606c'
down_revision = '954feddd63c5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_pokemon', schema=None) as batch_op:
        batch_op.add_column(sa.Column('shiny_counter', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_pokemon', schema=None) as batch_op:
        batch_op.drop_column('shiny_counter')

    # ### end Alembic commands ###
