"""Add nature base stats, ivs and evs

Revision ID: 0b19beed7599
Revises: 4a4f5f26dd41
Create Date: 2023-12-12 20:33:23.850639

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0b19beed7599'
down_revision = '4a4f5f26dd41'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('move', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'type', ['type_id'], ['id'])

    with op.batch_alter_table('pokemon', schema=None) as batch_op:
        batch_op.add_column(sa.Column('base_stats', sa.ARRAY(sa.Integer(), dimensions=1), nullable=True))

    with op.batch_alter_table('team_pokemon', schema=None) as batch_op:
        batch_op.add_column(sa.Column('nature_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('stats', sa.ARRAY(sa.Integer(), dimensions=1), nullable=True))
        batch_op.add_column(sa.Column('ivs', sa.ARRAY(sa.Integer(), dimensions=1), nullable=True))
        batch_op.add_column(sa.Column('evs', sa.ARRAY(sa.Integer(), dimensions=1), nullable=True))
        batch_op.add_column(sa.Column('tera_type_id', sa.Integer(), nullable=True))
        batch_op.drop_constraint('unique_moves_for_team_pokemon', type_='unique')
        batch_op.create_foreign_key(None, 'nature', ['nature_id'], ['id'])

    with op.batch_alter_table('nature', schema=None) as batch_op:
        batch_op.add_column(sa.Column('nature_id', sa.Integer(), nullable=True))
        
    op.execute("UPDATE nature SET nature_id = id")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('team_pokemon', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_unique_constraint('unique_moves_for_team_pokemon', ['move1_id', 'move2_id', 'move3_id', 'move4_id'])
        batch_op.drop_column('evs')
        batch_op.drop_column('ivs')
        batch_op.drop_column('nature_id')
        batch_op.drop_column('tera_type_id')

    with op.batch_alter_table('pokemon', schema=None) as batch_op:
        batch_op.drop_column('base_stats')

    with op.batch_alter_table('move', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('type_id')

    with op.batch_alter_table('nature', schema=None) as batch_op:
        batch_op.drop_column('nature_id')
    # ### end Alembic commands ###
